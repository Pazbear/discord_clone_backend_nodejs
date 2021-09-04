/**********USER***********/
/*
create TABLE SERVER(
	_id int auto_increment not null,
    name varchar(40) not null,
    host int not null,
    image varchar(50) default null,
    primary key(_id),
    foreign key(host) references USER (_id)
);
*/
/*************************/

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('server', {
        name: {
            type:DataTypes.STRING(40),
            allowNull:false,
        },
        image : {
            type:DataTypes.STRING(50),
            allowNull:true,
            defaultValue: null,
        },
    },
    {
        sequelize,
        timestamps: true,  //createdAt과 updatedAt을 생성
        underscored: false, //테이블명과 컬럼명을 snake case로 변경
        modelName: "SERVER",
        tableName: "SERVER",
        paranoid:false, // 삭제 시 완전삭제x, deletedAt에 기록
        charset:'utf8mb4', //이모티콘까지 입력
        collate:'utf8mb4_general_ci' //이모티콘까지 입력
    })
}