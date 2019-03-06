"use strict";
/**
 * Draw the debrief form the participant will see at the end of the experiment.
 *
 * @param submitFunction {function} - function to be called when the submit button is pressed
 */
export default function drawDebriefForm() {
    let owner = this;
    // Create form
    let div = document.querySelector('.jspsych-content').appendChild(document.createElement('div'));
    div.id = 'debriefContainer';
    div.className = 'debrief';
    let header = div.appendChild(document.createElement('h1'));
    header.id = 'debriefTitle';
    div.className = 'debrief';
    header.innerText = 'Thank you for participating!';
    let form = div.appendChild(document.createElement('form'));
    form.id = 'debriefForm';
    form.className = 'debrief';
    let comment = form.appendChild(document.createElement('div'));
    comment.id = 'debriefCommentContainer';
    comment.className = 'debrief';
    let commentQ = comment.appendChild(document.createElement('div'));
    commentQ.id = 'debriefCommentQuestion';
    commentQ.className = 'debrief';
    commentQ.innerHTML = 'Do you have any comments or concerns about the experiment? <em>(optional)</em>';
    let commentA = comment.appendChild(document.createElement('textarea'));
    commentA.id = 'debriefCommentAnswer';
    commentA.className = 'debrief';
    let ok = form.appendChild(document.createElement('button'));
    ok.innerText = 'submit';
    ok.className = 'debrief jspsych-btn';
    ok.onclick = function(e){
        e.preventDefault();
        owner.debriefFormSubmit(form);
    };
}