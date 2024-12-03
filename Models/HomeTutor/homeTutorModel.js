module.exports = (sequelize, DataTypes) => {
    const HomeTutor = sequelize.define("homeTutors", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        homeTutorName: {
            type: DataTypes.STRING
        },
        isGroupSO: {
            type: DataTypes.BOOLEAN
        },
        isPrivateSO: {
            type: DataTypes.BOOLEAN
        },
        yogaFor: {
            type: DataTypes.JSON // Children, parents
        },
        language: {
            type: DataTypes.JSON
        },
        specilization: {
            type: DataTypes.JSON
        },
        instructorBio: {
            type: DataTypes.STRING(1234)
        },
        approvalStatusByAdmin: {
            type: DataTypes.STRING,
            validate: {
                isIn: [['Pending', 'Approved', 'Rejected']]
            }
        },
        deletedThrough: {
            type: DataTypes.STRING,
            validate: {
                isIn: [['Admin', 'Instructor']]
            }
        },
        anyUpdateRequest: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        paranoid: true
    })
    return HomeTutor;
}