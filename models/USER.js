/**********USER***********/
/*
create TABLE USER(
	_id int auto_increment not null,
    email varchar(30) not null,
    password varchar(100) not null,
    name varchar(30) not null,
    avatar varchar(50) not null,
    is_enabled tinyint(1) default null,
    certified_key varchar(50) default null,
    created_at timestamp not null default current_timestamp,
    primary key(_id,email)
);
*/
/*************************/

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        email: {
            type: DataTypes.STRING(30),
            allowNull:false,
            unique:true,
        },
        password: {
            type:DataTypes.STRING(100),
            allowNull:false,
        },
        name: {
            type:DataTypes.STRING(30),
            allowNull:false,
        },
        avatar: {
            type:DataTypes.STRING(50),
            allowNull:false,
        },
        is_enabled: {
            type:DataTypes.BOOLEAN,
            allowNull:true,
            defaultValue : null
        },
        certified_key: {
            type:DataTypes.STRING(50),
            allowNull:true,
            defaultValue : null
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('now()'),
        },
    },
    {
            timestamps:false,
    })
}