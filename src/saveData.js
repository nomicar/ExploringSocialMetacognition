/**
 * Exploring Social Metacognition - data processing
 * Matt Jaquiery, Feb 2018
 * Nomi Carlebach, Feb 2019
 * Commented out unneeded variables and added new onws
 */

"use strict";

import {Trial, Advisor, Cue} from "./exploringSocialMetacognition.js";

export default function processData(data) {
    // Data about the participant
    let participantData = {
        id: data.participantId,
        blockCount: data.blockCount,
        difficultyStep: data.difficultyStep,
        dotCount: data.dotCount,
        preTrialInterval: data.preTrialInterval,
        fixationDuration: data.fixationDuration,
        preStimulusInterval: data.preStimulusInterval,
        stimulusDuration: data.stimulusDuration,
        feedbackDuration: data.feedbackDuration,
        adviceDuration: data.adviceDuration,
        secondStimulusDuration: data.secondStimulusDuration,
        feedbackCondition: data.feedbackCondition,
        timeStart: data.timeStart,
        timeEnd: data.timeEnd,
        experimentDuration: data.timeEnd - data.timeStart
    };

    // Advisor data
    let advisorData = [];
    if(typeof data.advisors !== 'undefined')
        for (let a=0; a<data.advisors.length; a++)
            advisorData.push(flattenAdvisorData(data.advisors[a], participantData.id));
    if(typeof data.practiceAdvisors !== 'undefined')
        for(let a = 0; a < data.practiceAdvisors.length; a++)
            advisorData.push(flattenAdvisorData(data.practiceAdvisors[a], participantData.id));
    participantData.advisors = advisorData;

    // Questionnaires
    let questionnaireData = [];
    if(typeof data.questionnaires !== 'undefined')
        for (let q=0; q<data.questionnaires.length; q++)
            questionnaireData.push(flattenQuestionnaireData(data.questionnaires[q], participantData.id))
    participantData.questionnaires = questionnaireData;

    // Trials
    let trialData = [];
    for (let t=0; t<data.trials.length; t++)
        trialData.push(flattenTrialData(data.trials[t], participantData.id));
    participantData.trials = trialData;

    /**
    // Generalized trust questionnaire
    if(typeof data.generalisedTrustQuestionnaire !== 'undefined')
        participantData.generalisedTrustQuestionnaire =
            flattenGTQ(data.generalisedTrustQuestionnaire, participantData.id);
     */

    // Debrief stuff
    participantData.debrief = [];
    if(typeof data.debrief !== 'undefined') {
        participantData.debrief = flattenDebriefData(data.debrief, participantData.id);
    }

    participantData.debriefRepQuiz = [];
    if(typeof data.dotRepQuiz !== 'undefined') {
        participantData.debriefRepQuiz = flattenDRQ(data.dotRepQuiz, participantData.id);
    }

    return participantData;
}

/** Return a trial squeezed into a format suitable for saving as .csv
 * @param {Trial} trial - trial object to squeeze
 * @param {int} id - id of the participant (inserted as first column)
 * @returns {Object} - slim representation of trial object
 */
function flattenTrialData(trial, id) {
    let out = {};
    out.participantId = id;
    out.id = trial.id;
    out.block = trial.block;
    out.practice = trial.practice;
    out.type = trial.type;
    out.typeName = trial.typeName;
    out.dotDifference = trial.dotDifference;
    out.dotsLow = trial.dotsLow;
    out.dotsHigh = trial.dotsHigh;
    out.correctAnswer = trial.whichSide;
    out.initialAnswer = trial.answer[0];
    out.finalAnswer = trial.answer[1];
    out.initialAnsCorrect = trial.answer[0] === trial.whichSide;
    out.initialConfidence = trial.confidence[0];
    out.finalConfidence = trial.confidence[1];
    out.advisorId = trial.advisorId;
    out.advisorAbove = trial.advisorAbove;
    out.resawStimulus = trial.resawStimulus;
    out.trialDifficulty = trial.trialDifficulty;
    out.advisorAgrees = trial.advisorAgrees;
    if (trial.advice !== null) {
        out.adviceSide = trial.advice.side;
        out.adviceString = trial.advice.string;
        out.adviceCorrect = trial.advice.side === trial.whichSide;
    }
    else {
        out.adviceSide = null;
        out.adviceString = null;
        out.adviceCorrect = null;
    }
    out.feedback = trial.feedback;
    out.grid = sha1.sha1(JSON.stringify(trial.grid)); // store the hash of the grid
    out.warnings = trial.warnings.join("\n");
    // timings
    if (trial.pluginResponse.length > 0) {
        // initial decision
        out.timeInitialStart = trial.pluginResponse[0].startTime;
        out.timeInitialFixation = trial.fixationDrawTime[0];
        out.timeInitialFrames = trial.framesDrawTime[0];
        out.timeInitialStimOn = trial.stimulusDrawTime[0];
        out.timeInitialStimOff = trial.pluginResponse[0].stimulusOffTime;
        out.stimPresentTime = trial.pluginResponse[0].stimulusOffTime - trial.stimulusDrawTime[0];
        out.timeInitialResponse = trial.pluginResponse[0].rt + trial.pluginResponse[0].startTime;
        out.initialRT = trial.pluginResponse[0].rt;
        if (trial.pluginResponse.length > 1) {
            // Information choice
            out.timeInfoChoiceStart = trial.pluginResponse[1].startTime;
            out.timeInfoChoiceMade = trial.pluginResponse[1].choiceTime;
            out.infoChoiceRT = trial.pluginResponse[1].choiceRT;
            // advice
            out.timeAdviceDisplayed = trial.pluginResponse[1].displayAdviceTime;
            out.additionalInfoDuraton = trial.pluginResponse[1].infoDuration;
            //review stim
            out.timeFinalFixation = trial.fixationDrawTime[1];
            out.timeFinalFrames = trial.framesDrawTime[1];
            out.timeFinalStimOn = trial.stimulusDrawTime[1];
            out.timeFinalStimOff = trial.pluginResponse[1].infoOff;
            // final decision
            out.timeFinalStart = trial.pluginResponse[2].startTime;
            out.timeFinalResponse = trial.pluginResponse[2].rt + trial.pluginResponse[2].startTime ;
            out.finalRT = trial.pluginResponse[2].rt;
            out.finalAnsCorrect = trial.answer[1] === trial.whichSide;
        }
        else {
            out.timeInfoChoiceStart = null;
            out.timeInfoChoiceMade =  null;
            out.infoChoiceRT =  null;
            // advice
            out.timeAdviceDisplayed =  null;
            out.additionalInfoDuraton =  null;
            //review stim
            out.timeFinalFixation =  null;
            out.timeFinalFrames =  null;
            out.timeFinalStimOn =  null;
            out.timeFinalStimOff =  null;
            // final decision
            out.timeFinalStart =  null;
            out.timeFinalResponse =  null;
            out.finalRT =  null;
            out.finallAnsCorrect = null;
        }
    }

    return out;
}

/**
 * Extract the key variables from the advisor object
 * @param {Advisor} data - advisor object
 * @param {int} id - id of the participant (inserted as first column)
 * @returns {Object} - slim representation of advisor object
 */
function flattenAdvisorData(data, id) {
    let out = {};
    out.participantId = id;
    out.id = data.id;
    out.adviceType = data.adviceType;
    out.advisorAccuracy = data.advisorAccuracy;
    out.portraitSrc = data.portraitSrc;
    out.styleClass = data.styleClass;
    return out;
}

/**
 * Extract the key variables from the questionnaire object
 * @param {Object[]} Q - questionnaire
 * @param {int} id - id of the participant (inserted as first column)
 * @returns {Object} - slim representation of questionnare object
 */
function flattenQuestionnaireData(Q, id) {
    let out = {};
    out.participantId = id;
    out.advisorId = Q.advisorId;
    out.afterTrial = Q.afterTrial;
    out.timeStart = Q.startTime;
    out.timeResponseStart = Q.responseStartTime;
    out.timeEnd = Q.time_elapsed;
    out.duration = Q.rt;
    for(let r=0; r < Q.response.length; r++) {
        switch(Q.response[r].name) {
            case 'Likeability':
                out.likeability = parseInt(Q.response[r].answer);
                break;
            case 'Benevolence':
                out.benevolence = parseInt(Q.response[r].answer);
                break;
            case 'Ability':
                out.ability = parseInt(Q.response[r].answer);
                break;
        }
    }
    return out;
}

/**
 * Extract the key variables from the trust questionnaire object
 * @param {Object[]} Q - trust questionnaire
 * @param {int} id - id of the participant (inserted as first column)
 * @returns {Object} - slim representation of trust questionnare object
 */
function flattenGTQ(Q, id) {
    let out = [];
    for(let r=0; r < Q.response.length; r++) {
        out[r] = {
            participantId: id,
            timeStart: Q.startTime,
            timeResponseStart: Q.responseStartTime,
            timeEnd: Q.time_elapsed,
            duration: Q.rt
        };
        out[r].order = Q.response[r].id;
        out[r].answer = Q.response[r].answer;
        out[r].prompt = Q.response[r].prompt;
        out[r].lastChangedTime = Q.response[r].lastChangedTime;
    }
    return out;
}

/**
 * Loop through the keys in all objects in data and pad each object to contain all keys (pad with null)
 * @param {Object[]} data debrief questions
 * @param {int} id participant id
 * @return {Object[]}
 */
function flattenDebriefData(data, id) {
    // List keys
    let keys = [];
    data.forEach(function(q) {
        Object.keys(q).forEach(function(key) {
            if(q.hasOwnProperty(key) && keys.indexOf(key) === -1)
                keys.push(key);
        });
    });

    // Pad missing keys with null
    data.forEach(function(q) {
        q.participantId = id;
        q.id = data.indexOf(q);
        keys.forEach((k)=>{if(typeof q[k] === 'undefined') q[k] = null})
    });

    return data;
}

function flattenDRQ(data, id) {
    let out = [];
    data.forEach((x)=> {
        x.participantId = id;
        x.grid = sha1.sha1(JSON.stringify(x.grid));
        out.push(x);
    });
    return out;
}