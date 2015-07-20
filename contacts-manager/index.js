/**
 * Manages the contacts and dispatch events on the websocket connection
 */
(function (moduleManager) {
    moduleManager.exports = contactsManager;

    // fake contacts data generators
    var faker = require('faker'); // https://github.com/marak/Faker.js/
    var shortid = require('shortid'); // https://github.com/dylang/shortid

    // flags whether random should allways return true
    var randomAlwaysTrue = 'ALWAYS' === process.env.RANDOM;

    /**
     * Random boolean value generator. The threshold depends on the likelhood:
     * - if likelihood >= 0, threshold is likelihood / (likelihood + 1). 2 => 2/3
     * - if likelihood < 0, threshold is 1 / (1 - likelihood). -2 => 1/3
     *
     * Note: if the application is launched with environment variable RANDOM = 'ALWAYS', rnd() returns allways true
     */
    function rnd(likelihood) {
        if (randomAlwaysTrue) {
            return true;
        }
        else {
            // default value for likelihood: 1 -> threshold = 0.5
            likelihood = ('undefined' === typeof likelihood) ? 1 : likelihood;
            var threshold;
            if (likelihood < 0) {
                threshold = 1 / (1 - likelihood)
            }
            else {
                threshold = likelihood / (likelihood + 1)
            }

            return Math.random() >= threshold;
        }
    }

    /**
     * Generates an email address
     *
     * @param firstname
     * @param lastname
     * @param domain used to build a professional email domain name
     */
    function createEmailAddress(firstname, lastname, domainname) {
        // creates the domain name from the lastname if undefined
        if (typeof domainname === 'undefined') {
            domainname = lastname.replace(/\W/g, '') + '.' + faker.internet.domainSuffix();
        }
        // no email address for missing domain name
        else if (domainname === null || domainname === '') {
            return null;
        }

        // creates the username part
        var username;
        if (rnd(-3)) {
            username = firstname + (rnd() ? '.' : '-') + lastname;
        }
        else if (rnd(-2)) {
            username = firstname.substring(0, 1) + (rnd() ? '.' : '-') + lastname;
        }
        else if (rnd(-1)) {
            username = firstname;
        }
        else {
            username = lastname;
        }

        return (username + '@' + domainname).toLowerCase();
    }

    /**
     * Generates a postal address
     * @param companyname used for a secondary street
     */
    function createAddress(companyname) {
        // default fake address
        var address = {
            street: faker.address.streetAddress(),
            zip: faker.address.zipCode(),
            city: faker.address.city(),
            country: faker.address.country()
        };

        if (companyname) {
            address.secondaryStreet = companyname + (rnd() ? ' campus' : ' plant');
        }
        else if (rnd(-2)) {
            address.secondaryStreet = faker.address.secondaryAddress();
        }

        return address;
    }

    function createDomainName(companyname) {
        return (companyname === null || typeof companyname === 'undefined') ? null : companyname.replace(/\W/g, '') + (rnd() ? '.com' : '.org');
    }

    /**
     * Generates a contact with all his data
     */
    function createContact() {
        var contact = {
            id: shortid.generate(),
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName()
        };

        /** professional data */
        // defines a company name (2/3)
        if (rnd(2)) {
            contact.company = faker.company.companyName();
            var domainname = createDomainName(contact.company);
            contact.workwebsite = 'www.' + domainname;

            // creates a work email address (2/3 chances)
            if (rnd(2)) {
                contact.workemail = createEmailAddress(contact.firstname, contact.lastname, domainname);
            }

            // creates a postal work address (1/3)
            if (rnd(-2)) {
                contact.workaddress = createAddress(contact.company);
            }
            // creates a work phone number (1/3)
            if (rnd(-2)) {
                contact.workphone = faker.phone.phoneNumber();
            }
        }

        /** personal data */
        // creates a personal email address (1/3 chances)
        if (rnd(-2)) {
            contact.homeemail = createEmailAddress(contact.firstname, contact.lastname);
        }

        // creates a personal phone number (1/3 chances)
        if (rnd(-2)) {
            contact.homephone = faker.phone.phoneNumber();
        }

        // creates a postal home address (1/3)
        if (rnd(-2)) {
            contact.homeaddress = createAddress();
        }

        // avatar image url (1/4 chances)
        if (rnd(-3)) {
            contact.avatar = faker.image.imageUrl();
        }

        return contact;
    }

    /**
     * Adds the new value in the patch if its actual value in the contact is different
     *
     * @param patch the object storing the data changes
     * @param contact the contact holding the actual values
     * @param property the contact property concerned by the value
     * @param newValue the new value of the property
     *
     * @return true for true value change
     */
    function addInPatch(patch, contact, property, newValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(contact[property])) {
            // adds the property:value in the patch
            patch[property] = newValue;

            // updates the contact property
            contact[property] = newValue;
            return true;
        }

        return false;
    }

    /**
     * Builds a patch containing only the data changes (and the contact id)
     * @param contact the contact from which to build the patch
     */
    function patchContact(contact) {
        var patch = { id: contact.id };
        if (rnd(-10)) {
            if (addInPatch(patch, contact, 'firstname', faker.name.firstName())) {
                addInPatch(patch, contact, 'homeemail', createEmailAddress(contact.firstname, contact.lastname));
                addInPatch(patch, contact, 'workemail', createEmailAddress(contact.firstname, contact.lastname, createDomainName(contact.company)));
            }
        }
        else if (rnd(-10)) {
            addInPatch(patch, contact, 'homeemail', rnd(-3) ? null : createEmailAddress(contact.firstname, contact.lastname));
        }

        if (rnd(-10)) {
            addInPatch(patch, contact, 'homephone', rnd(-3) ? null : faker.phone.phoneNumber());
        }

        if (rnd(-10)) {
            addInPatch(patch, contact, 'avatar', rnd(-3) ? null : faker.image.imageUrl());
        }

        if (rnd(-10)) {
            addInPatch(patch, contact, 'homeaddress', rnd(-3) ? null : createAddress());
        }
        // updates professional data
        if (rnd(-10)) {
            var companyName = rnd(-3) ? null : faker.company.companyName();
            addInPatch(patch, contact, 'company', companyName);
            // nullifies the professional data
            if (companyName === null) {
                addInPatch(patch, contact, 'workwebsite', null);
                addInPatch(patch, contact, 'workemail', null);
                addInPatch(patch, contact, 'workaddress', null);
                addInPatch(patch, contact, 'workphone', null);
            }
            // updates the otherwise
            else {
                // builds the domain name
                var domainname = createDomainName(contact.company);
                if (addInPatch(patch, contact, 'workwebsite', rnd(-3) ? null : 'www.' + domainname)) {
                    addInPatch(patch, contact, 'workemail', rnd(-3) ? null : createEmailAddress(contact.firstname, contact.lastname, domainname));
                }
                if (rnd(-5)) {
                    addInPatch(patch, contact, 'workaddress', rnd(-3) ? null : createAddress(contact.company));
                }
                if (rnd(-5)) {
                    addInPatch(patch, contact, 'workphone', rnd(-3) ? null : faker.phone.phoneNumber());
                }
                if (rnd(-8)) {
                    addInPatch(patch, contact, 'workaddress', rnd(-3) ? null : createAddress(contact.company));
                }
            }
        }

        return patch;
    }

    /**
     * Randomly builds and returns the contact update event
     *
     * @param eventType
     * @param contactsCache
     */
    function buildEvent(eventType, contactsCache) {
        switch (eventType) {
            // creates the contact, adds it to the cache and return the event
            case 'new':
                var contact = createContact();
                contactsCache.push(contact);
                return {type: eventType, contact: contact};

            // randomly deletes a contact from the cache and wraps the deleted id in the event
            case 'delete':
                var contact = contactsCache.splice(Math.floor(Math.random() * contactsCache.length), 1)[0];
                return {type: eventType, contact: {id: contact.id}};

            // randomly selects a contact and updates it
            case 'patch':
                var contact = contactsCache[Math.floor(Math.random() * contactsCache.length)];
                var patches = patchContact(contact);
                return {type: eventType, patches: patches};

            // unmanaged event types stop the application
            default:
                throw new Error(eventType + ' event is not managed.');
        }
    }

    /**
     * Periodically sends contacts updates on the websocket connection
     *
     * @param contactsCache an array of the contacts
     * @param connection the websocket connection
     */
    function periodicallyUpdateContacts(contactsCache, connection) {
        // the possible event types
        var eventTypes = [];

        // creates a first contact if the cache is empty
        if (contactsCache.length === 0) {
            eventTypes.push('new');
        }
        // no more contact addition, either delete or update one
        else if (contactsCache.length >= 40) {
            eventTypes.push('patch');
            eventTypes.push('delete');
        }
        else {
            eventTypes.push('new');
            eventTypes.push('patch');
            eventTypes.push('delete');
        }

        // builds the event to be pushed (picks a type randomly)
        var event = buildEvent(eventTypes[Math.floor(Math.random() * eventTypes.length)], contactsCache);

        // pushes the event to the browser
        connection.write(JSON.stringify(event));

        // plans the next event
        setTimeout(function() {
            periodicallyUpdateContacts(contactsCache, connection);
        }, 200 + 1500*Math.random());
    }

    /**
     * Periodically sends contact creations, updates or deletions on the websocket connection
     * @param connection the websocket connection
     */
    function contactsManager(connection) {
        periodicallyUpdateContacts([], connection);
    }
})(module);