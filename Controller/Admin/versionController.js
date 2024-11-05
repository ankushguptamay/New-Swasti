const db = require("../../Models");
const AppVersion = db.appVersion;

exports.addUpdateVersion = async (req, res) => {
  try {
    const latestVerision = req.body.latestVerision;
    if (!latestVerision) {
      return res.status(400).send({
        success: false,
        message: "Version is not present!",
      });
    }
    const version = await AppVersion.findAll();
    let message;
    if (version[0]) {
      message = "updated";
      await version[0].update({ latestVerision });
    } else {
      message = "added";
      await AppVersion.create({ latestVerision });
    }
    // Send final success response
    res
      .status(200)
      .send({ success: true, message: `Version ${message} successfully!` });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getVersion = async (req, res) => {
  try {
    const version = await AppVersion.findAll();
    // Send final success response
    res.status(200).send({ success: true, data: version[0] });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
