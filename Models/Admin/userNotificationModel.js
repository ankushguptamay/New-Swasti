module.exports = (sequelize, DataTypes) => {
    const UserNotification = sequelize.define("userNotifications", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        notification: {
            type: DataTypes.STRING(1234)
        },
        link: {
            type: DataTypes.STRING
        },
        isViewed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })
    return UserNotification;
}

// userId