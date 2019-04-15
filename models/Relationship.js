const monogoose = require("mongoose");
const Schema = monogoose.Schema;

const RelationshipSchema = new Schema({
    users: [{
        nickname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        userImg: {
            type: String,
            required: true
        },
        sex: {
            type: String,
            enum: ['female', 'male'],
            required: true
        },
        menstrualCycle:{
            beginning: {
                type: Date,
                default: new Date()
            },
            periodDays: {
                type: Number,
                default: 5
            },
            cycleDays: {
                type: Number,
                default: 28
            }
        },
        contraceptionCycle:{
            beginning: {
                type: Date,
                default: new Date()
            },
            daysOnPill: {
                type: Number,
                default: 21
            },
            daysOffPill: {
                type: Number,
                default: 7
            }
        },
        birthday: {
            type: Date
        },
        favorites: [
            {
                title: {
                    type: String,
                    required: true
                },
                content: {
                    type: String,
                    required: true
                }
            }
        ],
        wardrobe: [
            {
                title: {
                    type: String,
                    required: true
                },
                content: {
                    type: String,
                    required: true
                }
            }
        ],
        lifeInfo: [
            {
                title: {
                    type: String,
                    required: true
                },
                content: {
                    type: String,
                    required: true
                }
            }
        ],
        gift: [
            {
                title: {
                    type: String,
                    required: true
                },
                content: {
                    type: String,
                    required: true
                },
                img: {
                    type: String,
                    default: null
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        date : {
            type: Date,
            default: Date.now
        },
        settings: {
            lang:{
                type: String,
                required: true,
                default: 'pl',
                enum: ['en','pl'],
            },
            contraceptionCycle: {
                type: Boolean,
                required: true,
                default: false
            },
            menstrualCycle: {
                type: Boolean,
                required: true,
                default: false
            },
            intercourseHistory: {
                type: Boolean,
                required: true,
                default: true
            }
        }
    }],
    anniversaries: [
        {
            title: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true
            }
        }
    ],
    conversation: [{
        author: {
            type: String,
            require: true,
            default: 'Default'
        },
        // in 'img' case contains relative path to file on server
        content: {
            type: String,
            require: true
        },
        date:{
            type: Date,
            require: true
        },
        // could be 'tex' or 'img'
        type: {
            type: String,
            default: 'text'
        }

    }],
    events: [{
        createdByUser: Schema.Types.ObjectId,
        title: String,
        description: String,
        eventType: {
            type: String,
            enum: ['Me', 'Both', 'Partner', 'Menstruation', 'Contraception', 'Sex', 'ProtectedSex'],
            required: true
        },
        startDate: Date,
        endDate: Date
    }],
    invitCode: {
        type: String
    }
});



module.exports = Relationship = monogoose.model('relationships', RelationshipSchema)