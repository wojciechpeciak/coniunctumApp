const express = require("express");
const users = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ObjectId = require('mongoose').Types.ObjectId;

const Relationship = require('../models/Relationship');
users.use(cors());

process.env.SECRET_KEY = 'secret';


/*Relationship.findOneAndUpdate(
    {
        _id: ObjectId('5ca83b9dc6ecf608f8d4bdfc'),
        'users._id': ObjectId('5ca83b9dc6ecf608f8d4bdfd')
    },
    {
        $set: {
            'users.$.settings': {
                lang: 'en',
                contraceptionCycle: true,
                menstrualCycle: true,
                intercourseHistory: true
            }
        }
    },
    {
        new: true
    }
).then( updatedRelation => {
    console.log(updatedRelation);
})
.catch(err => {
    console.log('Error during user menstruation updating: ' + err);
});*/

users.post('/register', (req, res) => {
    // Prepare Relationship entity

    const relationship = {
        users: [
            {
                nickname: req.body.nickname,
                email: req.body.email,
                password: req.body.password,
                userImg: req.body.userImg,
                sex: req.body.sex,
                birthday: req.body.birthday,
                favorites: req.body.favorites,
                wardrobe: req.body.wardrobe,
                lifeInfo: req.body.lifeInfo
            }
        ],
        anniversaries: req.body.anniversaries,
        conversation: [],
        invitCode: makeid(5)
    };
    // Create relationship account
    Relationship.findOne(
        { "users.email": req.body.email },
        { users: 1 })
    .then(users => {
        if(!users)
        {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                relationship.users[0].password = hash;

                Relationship.create(relationship)
                .then(relDoc => {
                    res.json({message: req.body.email + ' registered', status: ture})
                })
                .catch(err => {
                    res.send('error: ' + err);
                });
            });
        } else {
            res.json({ error: 'Relationship with this email user already exists'});
        }
    })
    .catch(err => {
        res.send('error: ' + err);
    });
});

users.get('/login', (req, res) => {

    const email = req.query.email;

    Relationship.findOne(
        { "users.email": email},
        { users: 1}
    )
    .then( users => {
        if(users)
        {
            res.json({ email: email, valid: false });
        } else {
            res.json({ email: email, valid: true});
        }
    })
    .catch(err => {
        res.send('error: ' + err);
    });
});

users.post('/login', (req, res) => {

    Relationship.findOne(
        { "users.email": req.body.email }
        //,{ users: 1}
    )
    .then( relationship => {
        if (relationship) {
            const user = relationship.users.find( (item) => (item.email === req.body.email) )
            if(bcrypt.compareSync(req.body.password, user.password)) {
                // passwort match
                const payload = {
                    relationshipId: relationship._id,
                    userId: user._id,
                    nickname: user.nickname,
                    email: user.email,
                    sex: user.sex
                };
                let token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 1440 });
                res.send(token)
            } else {
                // password doesn't match
                res.json({ error: "User password doesn't match"});
            }
        } else {
            res.json( {error: 'User does not exist in DB'} );
        }
    })
    .catch( err => {
        res.send('error: ' + err);
    });
});

users.get('/library', (req, res) => {
    const relationshipId = req.query.relationshipId

    if(relationshipId){
        Relationship.aggregate([
            {$match: {_id: ObjectId(relationshipId)}},
            {$unwind: "$conversation" },
            {$match: { "conversation.type": "img" } },
            {$project: { conversation: 1 } }
        ])
        .then(list => {
            if (list) {
                res.json({list});
            } else {
                res.send('No images??')
            }
        })
        .catch(err => {
            console.log('Error during library content retrival: ', err);
        });
    }
});

users.get('/BigDate', (req, res) => {
    const {relationshipId, userId} = req.query;

    if (relationshipId && userId) {
        Relationship.findById( relationshipId, 
            {
                anniversaries: 1,
                "users._id": 1,
                "users.birthday": 1,
            })
        .then(result => {
            const anniversaries = [...result.anniversaries];

            const partnerBirthday = result.users.filter( (elem) => (elem.id !== userId));
            if (partnerBirthday[0]) {
                anniversaries.push( { title: "Partner's birthday", date: partnerBirthday[0].birthday});
            }

            if(anniversaries.length !== 0){
                anniversaries.sort( (a, b) => (a.date.getTime() - b.date.getTime()) );
                anniversaries.sort( (a, b) => (a.date.getMonth() - b.date.getMonth()) );

                const today = new Date();
                const filtered = anniversaries.filter( (elem) => {
                    if (elem.date.getMonth() > today.getMonth() ){
                        return true;
                    } else if (elem.date.getMonth() == today.getMonth() && elem.date.getDate() >= today.getDate() )
                        return true;
                    else
                        return false;
                });
                
                if(filtered.length === 0)
                    res.json(null);
                else {
                    const closestDate = filtered[0];
                    closestDate.date.setFullYear(today.getFullYear());
                    const days = Math.floor( ( closestDate.date.getTime() - today.getTime() ) / (24*60*60*1000) );
                    res.json( { title: closestDate.title, date: days } );
            }
            } else {
                res.json(null);

            }
            

        })
    }
});

users.get('/PartnersLabels', (req, res) => {
    const {relationshipId, userId} = req.query;

    if (relationshipId && userId) {
        Relationship.findById( relationshipId, 
            {
                "users._id": 1,
                "users.nickname": 1,
                "users.userImg": 1,
            })
        .then(result => {
            const user = result.users.find( (elem) => elem.id === userId);
            const partner = result.users.find( (elem) => elem.id !== userId);
             res.json( { user: user, partner: partner } );
        });
    }
});

users.get('/InvitCode', (req, res) => {
    const {relationshipId} = req.query;

    if (relationshipId) {
        Relationship.findById( relationshipId, 
            {
                invitCode: 1
            })
        .then(result => {
             res.json( { invitCode: result.invitCode } );
        });
    }
});

users.post('/pairPartner', (req, res) => {
    //Find partner
    Relationship.findOneAndUpdate(
        { invitCode: req.body.invitCode },
        {
            $set: { "users.0.email": '' }
        }
    ).then(partnerRelationship => {
        if( partnerRelationship && partnerRelationship.id !== req.body.relationshipId ){
            //Update user with partner data
            Relationship.findByIdAndUpdate(
                req.body.relationshipId,
                {
                    $push: { 
                        users: partnerRelationship.users[0],
                        anniversaries: { 
                            $each: partnerRelationship.anniversaries,
                            $sort: { date: 1 }
                        }, 
                        conversation: { 
                            $each: partnerRelationship.conversation,
                            $sort: { date: 1 }
                        } 
                    },
                    $set: { invitCode: null }
                },
                {
                    new: true
                }
            ).then( pairedRealtionship => {
                // paired succesfuly -> delete old partner relationship
                Relationship.findByIdAndDelete(
                    partnerRelationship.id
                ).then( deletedRelationsip => {
                    // sucessful pairing operation
                    res.json( { partnerPaired: true } );
                })
                .catch(err => {
                    console.log('Error during deleting partner relatiosip after pairing: ' + err);
                    res.send('Error during deleting partner relatiosip after pairing: ' + err);
                });
                
            })
            .catch( err => {
                console.log('Error during updating user relationship by invitCode: ' + err);
                res.send('Error during updating user relationship by invitCode: ' + err);

                // Error during pairing. Set email of partnerRelationship back to starting point
                Relationship.findByIdAndUpdate(
                    partnerRelationship.id,
                    {
                        $set: { "users.0.email": partnerRelationship.users[0].email }
                    }
                ).then( updatedPartnerRelationship => {
                    console.log('Partner relationship updated back to starting point', updatedPartnerRelationship);
                }) 
                .catch( err => {
                    console.log('Error during updating partner relationship back to satrting point', err);
                });
            });
        } else{
            // null if no relationship with given invitCode or if found relationshipId = user's realtionsipId
            res.json( { partnerPaired: false } );
        }
    })
    .catch( err => {
        console.log('Error during finding relationship by invitCode: ' + err);
        res.send('Error during finding relationship by invitCode: ' + err);
    });

});

users.get('/relationshipCard', (req, res) => {
    const {relationshipId, userId, arrayName} = req.query;
    // From query string
    const array = 'users.'+arrayName;

    if (relationshipId && userId) {
        Relationship.findById(
            relationshipId,
            {
                "users._id": 1,
                [array]: 1
            }
        ).then( relation => {
            const user = relation.users.find( elem => elem.id === userId );
            const partner = relation.users.find( elem => elem.id !== userId);

            const json = {
                user: user? user[arrayName] : [],
                partner: partner? partner[arrayName] : []
            };

            res.json( json );
        }).catch(err => {
            console.log('Retriving relationship card error: ', err);
            
        });
    }
});

users.post('/relationshipCard', (req, res) => {

    const { relationshipId, userId, cardArray, arrayName} = req.body;
    const setQuery = 'users.$.'+arrayName;

    // Find user's relationship
    Relationship.findOneAndUpdate(
        {
            _id: ObjectId(relationshipId),
            "users._id": ObjectId(userId)
        },
        {
            $set: {
                [setQuery]: cardArray
            }
        },
        {
            new: true
        }
    ).then( updatedRelation => {
        res.json( { cardUpdated: true } );
    })
    .catch(err => {
        console.log('Error during user card updating: ' + err);
        res.send('Error during user card updating: ' + err);
    });
});

users.get('/anniversaries', (req, res) => {
    const {relationshipId} = req.query;

    if (relationshipId) {
        Relationship.findById(
            relationshipId,
            {
                anniversaries: 1
            }
        ).then( relation => {
            relation.anniversaries.sort( (a, b) => (a.date.getTime() - b.date.getTime()) );
            const json = {
                anniversaries: relation.anniversaries
            };

            res.json( json );
        }).catch(err => {
            console.log('Retriving anniversaries card error: ', err);
            
        });
    }
});

users.post('/anniversaries', (req, res) => {

    const { relationshipId, cardArray} = req.body;

    // Find user's relationship
    Relationship.findByIdAndUpdate(
        relationshipId,
        {
            $set: {
                anniversaries: cardArray
            }
        },
        {
            new: true
        }
    ).then( updatedRelation => {
        res.json( { cardUpdated: true } );
    })
    .catch(err => {
        console.log('Error during user anniversaries updating: ' + err);
        res.send('Error during user anniversaries updating: ' + err);
    });
});

users.post('/dailyEvents', (req, res) => {

    const { relationshipId, event, currentPickedDate} = req.body;
    // curretnPickedDate is a ISO String
    // add event to calendar
    Relationship.findByIdAndUpdate(
        relationshipId,
        {
            $push: {
                events: event,
                $sort: { startDate: 1 }
            }
        },
        {
            new: true,
            projection: {
                events: 1
            }
        }
    ).then( updatedRelation => {
        // prepare constraint dates
        const bottomDate = new Date(currentPickedDate);
        const topDate = new Date( currentPickedDate );
        topDate.setDate(topDate.getDate() + 1);
        // set dates to milisec
        const bottomDateMili = bottomDate.getTime();
        const topDateMili = topDate.getTime();

        const filteredCurrentEvents = updatedRelation.events.filter( elem => {
            return (
                //start lower than topDate and end bigger than bottomDate
                 bottomDateMili <= elem.endDate.getTime() && elem.startDate.getTime() < topDateMili
            );
        });
        filteredCurrentEvents.sort( (a, b) => ( a.startDate.getTime() - b.startDate.getTime() ) );


        res.json( filteredCurrentEvents );
    }).catch( err => {
        console.log('Error during user calendar updating: ' + err);
        res.send('Error during user calendar updating: ' + err);
    });
});

users.get('/dailyEvents', (req, res) => {

    const { relationshipId, currentPickedDate} = req.query;
    // curretnPickedDate is a ISO String
    Relationship.findById(
        relationshipId,
        {
            events: 1
        }
    ).then( relationship => {
        // prepare constraint dates
        const bottomDate = new Date(currentPickedDate);
        const topDate = new Date( currentPickedDate );
        topDate.setDate(topDate.getDate() + 1);
        // set dates to milisec
        const bottomDateMili = bottomDate.getTime();
        const topDateMili = topDate.getTime();

        const filteredCurrentEvents = relationship.events.filter( elem => {
            return (
                //start lower than topDate and end bigger than bottomDate
                 bottomDateMili <= elem.endDate.getTime() && elem.startDate.getTime() < topDateMili
            );
        });
        filteredCurrentEvents.sort( (a, b) => ( a.startDate.getTime() - b.startDate.getTime() ) );


        res.json( filteredCurrentEvents );
    }).catch( err => {
        console.log('Error during user calendar getting: ' + err);
        res.send('Error during user calendar getting: ' + err);
    });
});

users.put('/dailyEvents', (req, res) => {

    const { relationshipId, event, currentPickedDate} = req.body;
    // curretnPickedDate is a ISO String
    // update event to calendar
    Relationship.findOneAndUpdate(
        {
            _id: ObjectId(relationshipId),
            "events._id": ObjectId(event._id)
        },
        {
            $set: {
                'events.$': event
            }
        },
        {
            new: true,
            projection: {
                events: 1
            }
        }
    ).then( updatedRelation => {
        // prepare constraint dates
        const bottomDate = new Date(currentPickedDate);
        const topDate = new Date( currentPickedDate );
        topDate.setDate(topDate.getDate() + 1);
        // set dates to milisec
        const bottomDateMili = bottomDate.getTime();
        const topDateMili = topDate.getTime();

        const filteredCurrentEvents = updatedRelation.events.filter( elem => {
            return (
                //start lower than topDate and end bigger than bottomDate
                 bottomDateMili <= elem.endDate.getTime() && elem.startDate.getTime() < topDateMili
            );
        });
        filteredCurrentEvents.sort( (a, b) => ( a.startDate.getTime() - b.startDate.getTime() ) );


        res.json( filteredCurrentEvents );
    }).catch( err => {
        console.log('Error during user calendar updating: ' + err);
        res.send('Error during user calendar updating: ' + err);
    });
});

users.delete('/dailyEvents', (req, res) => {

    const { relationshipId, eventId, currentPickedDate} = req.body;
    // curretnPickedDate is a ISO String
    // delet event to calendar
    Relationship.findByIdAndUpdate(
        relationshipId,
        {
            $pull: {
                events: { _id: ObjectId(eventId) }
            }
        },
        {
            new: true,
            projection: {
                events: 1
            }
        }
    ).then( updatedRelation => {
        // prepare constraint dates
        const bottomDate = new Date(currentPickedDate);
        const topDate = new Date( currentPickedDate );
        topDate.setDate(topDate.getDate() + 1);
        // set dates to milisec
        const bottomDateMili = bottomDate.getTime();
        const topDateMili = topDate.getTime();

        const filteredCurrentEvents = updatedRelation.events.filter( elem => {
            return (
                //start lower than topDate and end bigger than bottomDate
                 bottomDateMili <= elem.endDate.getTime() && elem.startDate.getTime() < topDateMili
            );
        });
        filteredCurrentEvents.sort( (a, b) => ( a.startDate.getTime() - b.startDate.getTime() ) );


        res.json( filteredCurrentEvents );
    }).catch( err => {
        console.log('Error during user calendar updating: ' + err);
        res.send('Error during user calendar updating: ' + err);
    });
});

users.get('/monthlyEvents', (req, res) => {

    const { relationshipId, currentPickedDate} = req.query;
    // curretnPickedDate is a ISO String
    Relationship.findOne(
        {
            _id: ObjectId(relationshipId),
        },
        {
            events: 1,
            'users.contraceptionCycle': 1,
            'users.menstrualCycle': 1,
            'users.settings': 1
        }
    ).then( relationship => {
        // prepare month array
        const monthArray = getMonthArray(currentPickedDate);
        // check if menstrualCycle or contraceptionCycle is active
        const userCycle = relationship.users.find( elem => {
            return elem.menstrualCycle.beginning !== null || elem.contraceptionCycle.beginning !== null;
        });
        //set predictions
        if(userCycle && userCycle.settings.menstrualCycle && userCycle.menstrualCycle.beginning !== null){
            monthArray.forEach( day => {
                // menstruation predictions
                day.menstruation = setMenstruationEvent(
                    day.date, 
                    userCycle.menstrualCycle.beginning, 
                    userCycle.menstrualCycle.periodDays, 
                    userCycle.menstrualCycle.cycleDays);
            });
        };
        if(userCycle && userCycle.settings.contraceptionCycle && userCycle.contraceptionCycle.beginning !== null){
            monthArray.forEach( day => {
                // contraception predictions
                day.contraception = setContraceptionEvent(
                    day.date, 
                    userCycle.contraceptionCycle.beginning, 
                    userCycle.contraceptionCycle.daysOnPill, 
                    userCycle.contraceptionCycle.daysOffPill);
            });
        }
        
        // set user's events        
        // filter event from current month
            // prepare constraint dates
        const bottomDate = new Date( monthArray[0].date.getTime() );
        const topDate = new Date( monthArray[monthArray.length - 1].date.getTime() );
        topDate.setDate(topDate.getDate() + 1);
        // set dates to milisec
        const bottomDateMili = bottomDate.getTime();
        const topDateMili = topDate.getTime();
        // filter month
        const filteredCurrentEvents = relationship.events.filter( elem => {
            return (
                //start lower than topDate and end bigger than bottomDate
                 bottomDateMili <= elem.endDate.getTime() && elem.startDate.getTime() < topDateMili
            );
        });
        filteredCurrentEvents.sort( (a, b) => ( a.startDate.getTime() - b.startDate.getTime() ) );
        // set user's events
        monthArray.forEach( day => {
            // set regular event

            const bottomDayDate = new Date(day.date.getTime());
            const topDayDate = new Date( day.date.getTime() );
            topDayDate.setDate(topDayDate.getDate() + 1);
            // set dates to milisec
            const bottomDayDateMili = bottomDayDate.getTime();
            const topDayDateMili = topDayDate.getTime();

            day.event = filteredCurrentEvents.find( elem => {
                return bottomDayDateMili <= elem.endDate.getTime() && elem.startDate.getTime() < topDayDateMili
                    && ( elem.eventType == 'Me' || elem.eventType === 'Both' || elem.eventType === 'Partner');
            }) ? true : false;
            // set menstruation event
            if(userCycle && userCycle.settings.menstrualCycle){
                day.menstruation = filteredCurrentEvents.find( elem => {
                    return elem.eventType === 'Menstruation' && elem.startDate.getTime() === day.date.getTime();
                }) ? 'Menstruation' : day.menstruation;
            }
            //  set contraception event
            if(userCycle && userCycle.settings.contraceptionCycle){
                day.contraception = filteredCurrentEvents.find( elem => {
                    return elem.eventType === 'Contraception' && elem.startDate.getTime() === day.date.getTime();
                }) ? 'Contraception' : day.contraception;
            }
            // set sex event
            const sexEvent = filteredCurrentEvents.find( elem => {
                return (elem.eventType === 'Sex' || elem.eventType === 'ProtectedSex') && elem.startDate.getTime() === day.date.getTime();
            });
            day.sex = sexEvent ? sexEvent.eventType : day.sex;
        });

        res.json( monthArray );
    }).catch( err => {
        console.log('Error during user monthlyEvents getting: ' + err);
        res.send('Error during user monthlyEvents getting: ' + err);
    });
});

users.get('/settings', (req, res) => {
    const {relationshipId, userId} = req.query;

    if (relationshipId && userId) {
        Relationship.findById(
            relationshipId,
            {
                "users.settings": 1,
                "users.menstrualCycle": 1,
                "users.contraceptionCycle": 1,
                "users._id": 1
            }
        ).then( relationship => {
            const user = relationship.users.find( elem => elem.id === userId);
            const resObj = {
                lang: user.settings.lang,
                intercourseHistory: user.settings.intercourseHistory,
                menstrualCycle: user.settings.menstrualCycle,
                menstrualCycleBeginnig: new Date(user.menstrualCycle.beginning),
                periodDays: user.menstrualCycle.periodDays,
                cycleDays: user.menstrualCycle.cycleDays,
                contraceptionCycle: user.settings.contraceptionCycle,
                contraceptionCycleBeginning: new Date(user.contraceptionCycle.beginning),
                daysOnPill: user.contraceptionCycle.daysOnPill,
                daysOffPill: user.contraceptionCycle.daysOffPill
            };

            res.json(resObj);
        }).catch(err => {
            console.log('Retriving settings card error: ', err);
        });
    }
});

users.post('/settings', (req, res) => {

    const { relationshipId, userId, configObj} = req.body;
    // prepare setting Obj
    let setObj = {
        "users.$.settings": {
            lang: configObj.lang,
            contraceptionCycle: configObj.contraceptionCycle,
            menstrualCycle: configObj.menstrualCycle,
            intercourseHistory: configObj.intercourseHistory
        }
    };
    if(configObj.menstrualCycle){
        setObj = {
            "users.$.menstrualCycle": {
                beginning: configObj.menstrualCycleBeginnig,
                periodDays: configObj.periodDays,
                cycleDays: configObj.cycleDays
            },
            ...setObj
        };
    }
    if(configObj.contraceptionCycle){
        setObj = {
            "users.$.contraceptionCycle": {
                beginning: configObj.contraceptionCycleBeginning,
                daysOnPill: configObj.daysOnPill,
                daysOffPill: configObj.daysOffPill
            },
            ...setObj
        };
    }
    // beginnings are in ISO String
    Relationship.findOneAndUpdate(
        {
            _id: ObjectId(relationshipId),
            "users._id": ObjectId(userId)
        },
        {
            $set: setObj
        },
        {
            new: true,
            projection: {
                _id: 1
            }
        }
    ).then( relationshipId => {
        res.json({ cardUpdated: true });
    }).catch( err => {
        console.log('Error during user settings updating: ' + err);
        res.send('Error during user settings updating: ' + err);
    });
});


module.exports = users

function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

  function getMonthArray(pickedDate) {
    const picked = new Date(pickedDate);
    picked.setHours(0,0,0,0);

    const monthStart = new Date(picked.toISOString());
    monthStart.setDate(1);

    const monthEnd = new Date(picked.toISOString());
    monthEnd.setMonth(picked.getMonth() + 1);
    monthEnd.setDate(0);
    
    const monthArray = [];
    for (let currentDay = new Date(monthStart.toISOString()); currentDay <= monthEnd; currentDay.setDate(currentDay.getDate() + 1)) {
      monthArray.push({
        date: new Date(currentDay.toISOString()),
        event:          null,
        menstruation:   null,
        sex:            null,
        contraception:  null
      });
    }
    
    return monthArray;
  }

  function setMenstruationEvent(dayDate, beginning, periodDays, cycleDays) {
    if (Math.floor( dayDate.getTime() / (24 * 60 * 60 * 1000) ) - Math.floor( beginning.getTime() / (24 * 60 * 60 * 1000) ) >= 0) {
        // past days since last whole cycle
        let pastDays = Math.floor((dayDate.getTime() - beginning.getTime()) % (cycleDays * 24 * 60 * 60 * 1000) / (24 * 60 * 60 * 1000));
        //return menstruation event
        if (0 <= pastDays && pastDays < periodDays) {
            return 'Predicted';
        } else if ((cycleDays - 18 -1/* Bacause of 0 indexing */) <= pastDays && pastDays < (cycleDays - 10)) {
            return 'Ovulation';
        }
    } 
        return null;
}


  function setContraceptionEvent(dayDate, beginning, daysOnPill, daysOffPill){
    if (Math.floor( dayDate.getTime() / (24 * 60 * 60 * 1000) ) - Math.floor( beginning.getTime() / (24 * 60 * 60 * 1000) ) >= 0) {
        // past days since last whole cycle
        const temp = (new Date(beginning.getTime())).toISOString();
        const temp2 = (new Date(dayDate.getTime())).toISOString();

        const pastDays = Math.round( (dayDate.getTime() - beginning.getTime()) / (24 * 60 * 60 * 1000) ) % (daysOnPill + daysOffPill) + 1;
        //return menstruation event
        if (0 <= pastDays && pastDays <= daysOnPill) {
            return 'Predicted';
        } 
    }
    return null;
  }