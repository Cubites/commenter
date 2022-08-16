import Sequelize from "sequelize";

const Model = Sequelize.Model;

class User extends Model {
    User.init({
        user_id: {
            type: int,
            primaryKey: true,
        }
    }, {
        sequelize,
        modelName: 'User',
        freezeTableName: true,
        timeStamp: false
    })
}

module.epxorts = User;