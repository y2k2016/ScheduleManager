use ScheduleManagerDB
db.dropDatabase()
use ScheduleManagerDB
db.createUser({
user:"ScheduleManager",
pwd:"123456",
roles:[{role:"readWrite",db:"ScheduleManagerDB"}]
})