module.exports = (sequelize, DataTypes) => {
    return sequelize.define('matching', {
        createdAt:{
            type:DataTypes.STRING(8),
            allowNull:false
        }
    },
    {
        sequelize,
        timestamps: false,  //createdAt과 updatedAt을 생성
        underscored: false, //테이블명과 컬럼명을 snake case로 변경
        modelName: "MATCHING",
        tableName: "MATCHING",
        paranoid:false, // 삭제 시 완전삭제x, deletedAt에 기록
        charset:'utf8mb4', //이모티콘까지 입력
        collate:'utf8mb4_general_ci' //이모티콘까지 입력
    })
}