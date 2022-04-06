const Database = require('../db/config')

module.exports = {
    async index(req, res){
        const db = await Database()
        const roomId = req.params.room
        const questionId = req.params.question
        const action = req.params.action
        const password = req.body.password

        /* Verificar se a senha está correta */
        const verifyRoom = await db.get(`SELECT * FROM rooms WHERE id = ${roomId}`)
        if(verifyRoom.pass == password){
            if(action == "delete"){

                await db.run(`DELETE FROM questions WHERE id = ${questionId}`)

            }else if(action == "check"){

                await db.run(`UPDATE questions SET read = 1 WHERE id = ${questionId}`)

            }
            res.redirect(`/room/${roomId}`)
        } else{
            res.render('passincorrect', {roomId: roomId})
        }


    },

    async create(req, res){
        const db = await Database()
        const question = req.body.question
        const roomId = req.params.room

        await db.run(`INSERT INTO questions(
            title,
            room,
            read
        )VALUES(
            "${question}",
            ${roomId},
            0
        )`)

        res.redirect(`/room/${roomId}`)
    },

    async open(req,res){
      const db = await Database()
      const roomId = req.params.room
      const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 0`)
      const questionsRead = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and red = 1`)
      let isNoQuestions

      if(questions.length ==0){
          if(questionsRead.length ==0){
              isNoQuestions = true
          }
      }

      res.render("room", {roomId: roomId, questions: questions, questionsRead: questionsRead, isQuestions: isQuestions})
    },

    ente(req, res){
        const roomId = req.body.roomId
        
        res.redirect(`/room/${roomId}`)

    }
}