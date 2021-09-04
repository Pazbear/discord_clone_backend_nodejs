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
    },
    {
        sequelize,
        timestamps: true,  //createdAt과 updatedAt을 생성
        underscored: false, //테이블명과 컬럼명을 snake case로 변경
        modelName: "USER",
        tableName: "USER",
        paranoid:false, // 삭제 시 완전삭제x, deletedAt에 기록
        charset:'utf8mb4', //이모티콘까지 입력
        collate:'utf8mb4_general_ci' //이모티콘까지 입력
    })
}