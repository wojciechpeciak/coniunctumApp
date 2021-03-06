import axios from 'axios';
import jwt_decode from 'jwt-decode'; 

export const register = newUser => {
    return axios
        .post('/users/register', {
            ...newUser
        })
        .then(response => {
            console.log('Registered');
        });
};

export const checkEmail = email => {
    return axios
        .get('/users/login', {
            params: {
                email: email
            }
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log('CheckEmail request error: ', err);
        });
};

export const login = user => {
    return axios
        .post('/users/login', {
            email: user.email,
            password: user.password
        })
        .then(response => {
            if (response.data.error === undefined){
                localStorage.setItem('usertoken', response.data);
            }
            return response.data;
        })
        .catch(err => {
            console.log('loggin request error: ' + err);
        });
};

export const getBigDate = user => {

    const {relationshipId, userId} = user;

    return axios
        .get('/users/BigDate', {
            params: {
                relationshipId: relationshipId.toString(),
                userId: userId
            }
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log('getBigDate request error: ', err);
        });
}

export const getPartnersLabels = user => {
    return axios
        .get('/users/PartnersLabels', {
            params: {
                relationshipId: user.relationshipId,
                userId: user.userId
            }
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log('getPartnersLabels request error: ', err);
        });
}

export const getLibrary = relationshipId => {
    return axios
        .get('/users/library', {
            params: {
                relationshipId: relationshipId
            }
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log('library request error: ' + err);
        });
};

export const getInvitCode = relationshipId => {
    return axios
        .get('/users/InvitCode', {
            params: {
                relationshipId: relationshipId
            }
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log('library request error: ' + err);
        });
};

export const pairPartner = (relationshipId, invitCode) => {
    return axios
        .post('/users/pairPartner', {
            relationshipId: relationshipId,
            invitCode: invitCode
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log('Partner pairing request error: ' + err);
        });
};

export const getRelationshipCard = (relationshipId, userId, cardName) => {
    return axios
        .get('/users/relationshipCard', {
            params: {
                relationshipId: relationshipId,
                userId: userId,
                arrayName: cardName
            }
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log('Relationship card request error: ' + err);
        });
};

export const updateRelationshipCard = (relationshipId, userId, cardArray, cardName) => {
    return axios
        .post('/users/relationshipCard', {
            relationshipId: relationshipId,
            userId: userId,
            cardArray: cardArray,
            arrayName: cardName
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log('updateRelatinshipCard request error: ' + err);
        });
};

export const getAnniversaries = (relationshipId) => {
    return axios
        .get('/users/anniversaries', {
            params: {
                relationshipId: relationshipId,
            }
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log('Anniversaries card request error: ' + err);
        });
};

export const updateAnniversaries = (relationshipId, cardArray) => {
    return axios
        .post('/users/anniversaries', {
            relationshipId: relationshipId,
            cardArray: cardArray
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log('updateRelatinshipCard request error: ' + err);
        });
};

export const createEvent = (relationshipId, event, currentPickedDate) => {
    return axios
        .post('/users/dailyEvents', {
            relationshipId: relationshipId,
            event: event,
            currentPickedDate: currentPickedDate
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log('clendarEvents post request error: ' + err);
        });
};

export const getDailyEvents = (relationshipId, currentPickedDate) => {
    return axios
        .get('/users/dailyEvents', {
            params: {
                relationshipId: relationshipId,
                currentPickedDate:currentPickedDate
            }
        }).then( response => {
            return response.data;
        })
        .catch(err => {
            console.log('clendarEvents get request error: ' + err);
        });
};

export const updateEvent = (relationshipId, event, currentPickedDate) => {
    return axios
        .put('/users/dailyEvents', {
            relationshipId: relationshipId,
            event: event,
            currentPickedDate: currentPickedDate
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log('clendarEvents put request error: ' + err);
        });
};

export const delteEvent = (relationshipId, eventId, currentPickedDate) => {
    return axios
        .delete('/users/dailyEvents', {
            data: {
                relationshipId: relationshipId,
                eventId: eventId,
                currentPickedDate: currentPickedDate
            }
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log('clendarEvents delete request error: ' + err);
        });
};

export const getMonthlyEvents = (relationshipId, currentPickedDate) => {
    return axios
        .get('/users/monthlyEvents', {
            params: {
                relationshipId: relationshipId,
                currentPickedDate: currentPickedDate
            }
        }).then( response => {
            return response.data;
        })
        .catch(err => {
            console.log('clendarEvents get request error: ' + err);
        });
};

export const getSettings = (relationshipId, userId) => {
    return axios
        .get('/users/settings', {
            params: {
                relationshipId: relationshipId,
                userId: userId
            }
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log('Settings card request error: ' + err);
        });
};

export const updateSettings = (relationshipId, userId, configObj) => {
    return axios
        .post('/users/settings', {
            relationshipId: relationshipId,
            userId: userId,
            configObj: configObj
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log('Settings card update request error: ' + err);
        });
};

export const upload = data => {
    return axios
        .post('/upload', data)
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log('File upload request error: ' + err);
        });
};

//resolve usertoken
export const resolveUserToken = localStor => {
    if(localStor.usertoken === undefined) {
        return false;
    } else {
        const token = localStor.usertoken;
        const decoded = jwt_decode(token);
        return decoded;
    }
}