const db = require("../../Models");
const {
  bookHTValidation,
} = require("../../Middleware/Validate/validateHomeTutor");
const HTPrice = db.hTPrice;
const HTPayment = db.hTPayment;
const HTTimeSlot = db.hTTimeSlote;
const HomeTutor = db.homeTutor;
const { RAZORPAY_KEY_ID, RAZORPAY_SECRET_ID } = process.env;
const { Op } = require("sequelize");

// Razorpay
const Razorpay = require("razorpay");
const crypto = require("crypto");
const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_SECRET_ID,
});

exports.createHTOrder = async (req, res) => {
  try {
    // Validate body
    const { error } = bookHTValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { amount, currency, receipt, couponCode, hTSlotId } = req.body; // receipt is id created for this order
    const userId = req.user.id;

    const timeSlote = await HTTimeSlot.findOne({
      where: {
        id: hTSlotId,
        appointmentStatus: "Active",
        isBooked: false,
        deletedThrough: null,
      },
      attributes: [
        "id",
        "startDate",
        "time",
        "serviceType",
        "availableSeat",
        "durationType",
        "homeTutorId",
        "bookedSeat",
        "priceId",
      ],
      raw: true,
    });
    if (!timeSlote) {
      return res.status(400).send({
        success: false,
        message: "This slote is not present or can not be book!",
      });
    }

    // Validate date
    // Check is date have been passed
    const today = new Date();
    today.setMinutes(today.getMinutes() + 390); // 5.5 hours and 1 hours, user should book a slot 1 hour ahead of slot time
    const date = `${timeSlote.startDate.toISOString().slice(0, 10)}T${
      timeSlote.time
    }:00.000Z`;
    const inMiliSecond = new Date(date).getTime();
    if (inMiliSecond <= today.getTime()) {
      return res.status(400).send({
        success: false,
        message: `Booking Unavailable, Bookings need to be made at least 1 hour in advance!`,
      });
    }

    let totalPeople = req.body.totalPeople;
    // Number
    if (timeSlote.serviceType === "Private") {
      totalPeople = 1;
    } else {
      const availableSeat =
        parseInt(timeSlote.availableSeat) - parseInt(timeSlote.bookBy);
      if (availableSeat < totalPeople) {
        return res.status(400).send({
          success: false,
          message: `Soory! Only ${availableSeat} seat are available!`,
        });
      }
    }

    // initiate payment
    razorpayInstance.orders.create(
      { amount, currency, receipt },
      (err, order) => {
        if (!err) {
          HTPayment.create({
            durationType: timeSlote.durationType,
            totalPeople,
            hTSlotId: hTSlotId,
            homeTutorId: timeSlote.homeTutorId,
            userId: userId,
            amount: amount / 100,
            currency,
            receipt,
            razorpayOrderId: order.id,
            status: "Created",
            razorpayTime: order.created_at,
            verify: false,
            couponCode: couponCode,
          })
            .then(() => {
              res.status(201).send({
                success: true,
                message: `Order craeted successfully!`,
                data: order,
              });
            })
            .catch((err) => {
              res.status(500).send({
                success: false,
                err: err.message,
              });
            });
        } else {
          res.status(500).send({
            success: false,
            err: err.message,
          });
        }
      }
    );
  } catch (err) {
    res.status(500).send({
      success: false,
      err: err.message,
    });
  }
};

exports.verifyHTPayment = async (req, res) => {
  try {
    const orderId = req.body.razorpay_order_id;
    const paymentId = req.body.razorpay_payment_id;
    const razorpay_signature = req.body.razorpay_signature;
    // Creating hmac object
    let hmac = crypto.createHmac("sha256", RAZORPAY_SECRET_ID);
    // Passing the data to be hashed
    hmac.update(orderId + "|" + paymentId);
    // Creating the hmac in the required format
    const generated_signature = hmac.digest("hex");
    // Find Payment record
    const purchase = await HTPayment.findOne({
      where: { razorpayOrderId: orderId },
      raw: true,
    });
    if (!purchase) {
      res.status(400).json({
        success: false,
        message: "This payment order is not present!",
      });
    } else if (purchase.verify === false && purchase.status === "Created") {
      if (razorpay_signature === generated_signature) {
        const timeSlote = await HTTimeSlot.findOne({
          where: { id: purchase.timeSloteId },
          raw: true,
        });
        const bookedSeat =
          timeSlote.serviceType === "Group"
            ? parseInt(timeSlote.bookedSeat) + parseInt(purchase.totalPeople)
            : 1;
        // Update Slote
        await timeSlote.update({ ...timeSlote, isBooked: true, bookedSeat });
        // Update Purchase
        await purchase.update({
          ...purchase,
          status: "Paid",
          razorpayPaymentId: paymentId,
          verify: true,
          paidThrough: "Online",
        });
        res.status(200).json({
          success: true,
          message: "Payment verified successfully!",
        });
      } else {
        await purchase.update({
          ...purchase,
          status: "Failed",
        });
        res.status(400).json({
          success: false,
          message: "Payment verification failed!",
        });
      }
    } else if (purchase.verify === true && purchase.status === "Paid") {
      res.status(200).json({
        success: true,
        message: "Payment has been verified!",
      });
    } else {
      res.status(400).json({
        success: true,
        message: "Unexpected error!",
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      err: err.message,
    });
  }
};

exports.getMyHTBookedSloteForUser = async (req, res) => {
  try {
    const booking = await HTPayment.findAll({
      where: {
        userId: req.user.id,
        verify: true,
        status: "Paid",
      },
      attributes: [
        "id",
        "durationType",
        "amount",
        "currency",
        "receipt",
        "status",
        "verify",
        "couponCode",
        "totalPeople",
        "paidThrough",
        "createdAt",
      ],
      include: [
        {
          model: HTTimeSlot,
          as: "hTSlots",
          where: { deletedThrough: null },
          attributes: [
            "id",
            "date",
            "time",
            "password",
            "timeDurationInMin",
            "isBooked",
            "isOnline",
            "serviceType",
            "bookedSeat",
            "appointmentStatus",
            "homeTutorId",
          ],
          required: false,
          include: [
            {
              model: HTPrice,
              as: "hTPrices",
              attributes: [
                "id",
                "priceName",
                "private_PricePerDayPerRerson",
                "group_PricePerDayPerRerson",
                "private_totalPricePerPerson",
                "group_totalPricePerPerson",
                "durationType",
              ],
              required: false,
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const transFormData = [];
    for (let i = 0; i < booking.length; i++) {
      transFormData.push({
        ...booking.hTSlots,
        id: booking.dataValues.id,
        durationType: booking.dataValues.durationType,
        amount: booking.dataValues.amount,
        currency: booking.dataValues.currency,
        receipt: booking.dataValues.currency,
        status: booking.dataValues.status,
        verify: booking.dataValues.verify,
        couponCode: booking.dataValues.couponCode,
        totalPeople: booking.dataValues.totalPeople,
        paidThrough: booking.dataValues.paidThrough,
        createdAt: booking.dataValues.createdAt,
      });
    }

    // Final Response
    res.status(200).send({
      success: true,
      message: "My home tutor booked slote fetched successfully!",
      data: transFormData,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getMyHTBookedSloteForInstructor = async (req, res) => {
  try {
    const { date, isBooked, search, isOnline } = req.query;
    // 3 days validity
    const date1 = JSON.stringify(new Date());
    let dateCondition;
    if (date) {
      dateCondition = date;
    } else {
      dateCondition = date1.slice(1, 11);
    }

    // Get instructor Home tutor
    const homeTutor = await HomeTutor.findAll({
      where: { instructorId: req.user.id },
    });
    const homeTutorId = [];
    for (let i = 0; i < homeTutor.length; i++) {
      homeTutorId.push(homeTutor[i].id);
    }
    // Where condition
    const condition = [{ id: homeTutorId }, { date: dateCondition }];
    if (isBooked) {
      condition.push({ isBooked: isBooked });
    } else {
      condition.push({ isBooked: true });
    }
    if (search) {
      condition.push({
        [Op.or]: [{ sloteCode: { [Op.substring]: search } }],
      });
    }

    if (isOnline) {
      if (isOnline === "true") {
        condition.push({ isOnline: true });
      } else if (isOnline === "false") {
        condition.push({ isOnline: false });
      }
    }

    const slote = await HTTimeSlot.findAll({
      where: {
        [Op.and]: condition,
      },
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: "My home tutor booked slote fetched successfully!",
      data: slote,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
