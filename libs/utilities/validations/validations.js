const ERRORS = require('../common/common').ERRORS;

class Validations {
    static validateCreateFields = (validationFields, payloadFields) => {
        const requiredError = this.validateRequiredFields(validationFields.filter(field => field.required), payloadFields);
        const minLengthError = this.validateMinLength(validationFields.filter(field => field.minLength), payloadFields);
        const patternError = this.validatePatterns(validationFields.filter(field => field.pattern), payloadFields);

        return requiredError || minLengthError || patternError || null;
    }

    static validateEditFields = (validationFields, payloadFields) => {
        const requiredError = this.validateRequiredFields(validationFields.filter(field => field.requiredOnEdit), payloadFields);
        const atLeastOneEditableFieldPresent = this.validateNoEditableFields(validationFields.filter(field => field.editable), payloadFields);
        const invalidFields = this.validateInvalidFields(validationFields, payloadFields);

        return requiredError || atLeastOneEditableFieldPresent || invalidFields || null;
    }

    static validateRequiredFields = (requiredFields, payloadFields) => {
        const failedRequireValidations = requiredFields.filter(field => {
            return !Object.keys(payloadFields).includes(field.name);
        })
        if(failedRequireValidations.length) {
            return ERRORS.INVALID_REQUIRED_FIELDS(failedRequireValidations.map(field => field.name))
        }
        return null;
    }

    static validateMinLength = (lengthFields, payloadFields) => {
        const failedMinLengthValidations = lengthFields.filter(field => !(field.minLength < payloadFields[field.name]?.length));
        if(failedMinLengthValidations.length) {
            return ERRORS.INVALID_MIN_LENGTH(failedMinLengthValidations.map(field => field.name))
        }
        return null;
    }

    static validatePatterns = (patternFields, payloadFields) => {
        const failedPatternValidations = patternFields.filter(field => !(payloadFields[field.name]?.match(field.pattern)));
        if(failedPatternValidations.length) {
            return ERRORS.INVALID_PATTERN(failedPatternValidations.map(field => field.name))
        }
        return null;
    }

    static validateNoEditableFields = (validationFields, currentFields) => {
        const isAtLeastOneFieldPresent = validationFields.filter(field => currentFields[field.name]).length;
        if(isAtLeastOneFieldPresent) {
            return null;
        }
        return ERRORS.NO_EDITABLE_FIELD();
    }

    static validateInvalidFields = (validationFields, payloadFields) => {
        const availableFields = validationFields.map(field => field.name);
        const invalidFields = Object.keys(payloadFields).filter(fieldName => !availableFields.includes(fieldName));

        if(invalidFields.length) {
            return ERRORS.INVALID_FIELDS_PROVIDED(invalidFields);
        }

        return null;
    }

    static payloadValidation = (payload) => {
        try {
            return JSON.parse(payload)
        } catch (err) {
            return { error: err.toString() };
        }
    }

}

module.exports = Validations;
