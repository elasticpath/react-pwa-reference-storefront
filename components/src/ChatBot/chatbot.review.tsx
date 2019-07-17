/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */

import React from "react";
import Amplify, { Interactions } from 'aws-amplify';
import awsmobile from "../../../app/src/aws-exports";
import './chatbot.review.less';

Amplify.configure(awsmobile);

// Global values
const botName = "EPConversationalInterface";

interface ReviewProps {
    steps?: any,
    triggerNextStep: (...args: any[]) => any,
}

interface ReviewState {
    userMessage: string,
    finalMessage: string,
    productImageUrl: string,
}

class Review extends React.Component<ReviewProps, ReviewState> {
    constructor(props) {
        super(props);

        this.state = {
            userMessage: '',
            finalMessage: '',
            productImageUrl: '',
        };
    }

    // Performs actions of using Interactions.send(botName, targetInput)
    async submitMessage() {
        const { steps, triggerNextStep } = this.props;
        const { message } = steps.userMessage;

        // Send input to Lex
        const response = await InvokeIntent(message);

        // CUSTOM - Check for response card, log imageUrl
        if (response.responseCard) {
            // currentImage = response.responseCard.genericAttachments[0].imageUrl;
            this.setState({ productImageUrl: response.responseCard.genericAttachments[0].imageUrl });
        }

        this.setState({ userMessage: response.message });
        // CUSTOM - Display final message upon transaction completion.
        if (response.dialogState === 'Fulfilled') {
            if (response.intentName === 'CheckoutCartIntent') {
                const finalMessage = response.message;
                this.setState({ finalMessage });
                // document.getElementsByClassName('rsc-input')[0].disabled = true;
                // document.getElementsByClassName('rsc-submit-button')[0].disabled = true;
                // triggerNextStep({trigger: 'end-message'});
            }
        }
    }

    componentWillMount() {

        this.submitMessage();
    }

    render() {
        const { userMessage, productImageUrl } = this.state;
        if (userMessage) {
            return (
                <div style={{width: '100%'}}>
                    <div className="chatbot-review">
                        {userMessage}
                        {productImageUrl && <img src={productImageUrl} alt="" />}
                    </div>
                </div>
            );
        }
        return (
            <span className="rsc-loading">
                <span className="sc-bdVaJa hseFPs">.</span>
                <span className="sc-bdVaJa iTWArB">.</span>
                <span className="sc-bdVaJa dUwKYp">.</span>
            </span>
        );
    }
}

// This function calls the intent defined by @param modelInput.
async function InvokeIntent(utterance) {
    const response = await Interactions.send(botName, utterance);
    Interactions.onComplete(botName, handleCompleteIntent);
    return response;
}

// Function for handling external fulfillent of Lex Intents
const handleCompleteIntent = function (err, confirmation) {
    if (err) {
        console.log('Conversation failed...');
        return;
    }
    return 'Conversation success!';
}

export default Review;
