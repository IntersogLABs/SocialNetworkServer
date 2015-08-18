# SocialNetworkServer

Отрефакторить /registration запрос:

      сделать проверки        OK
      хэшировать пароль


Сделать API для следующих запросов:

GET :

      /post - возвращает список всех записей                                                                        OK
      
      /posts/:id - возвращает запись с заданным id (req.param.id)                                                   OK
      
      /user/:id/following - возвращает список кумиров указанного юзера (кого этот юзер фолловит, отслеживает)       OK
      
      /user/:id/folowers - возвращает список фанатов указанного юзера (кто отслеживает указанного юзера)            OK
      
      
DELETE:

      /posts/:id - удаляет запись с заданным id (только если currentUser.id == author.id || currentUser.id == owner.id)                                                                                                           OK
      
      /user/:id/follow - отписаться (перестать отслеживать) от юзера с заданным id                                  OK
      
      
PUT:

      /me - редактировать данные о себе                                                                             OK
      
      /posts/:id редактировать запись (только если currentUser.id == author.id)                                     OK
      
      
POST:

      /user/:id/follow - подписаться на юзера с заданным id                                                         OK
      
