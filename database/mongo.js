db=db.getSiblingDB("lab4");
db.createCollection("logs");
db.logs.createIndex({level:1,createdAt:-1,_id:-1},{name:"idx_level_time_id"});
