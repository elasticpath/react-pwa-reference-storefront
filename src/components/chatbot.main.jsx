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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatBot, { Loading } from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

import imgPlaceholder from '../images/img-placeholder.png';

import './chatbot.main.less';

class DBPedia extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: '',
      results: [],
      trigger: false,
    };

    this.triggetNext = this.triggetNext.bind(this);
  }

  componentWillMount() {
    // const self = this;
    // const { steps } = this.props;
    // const search = steps.search.value;
    // const endpoint = encodeURI('https://dbpedia.org');
    // const query = encodeURI(`
    //   select * where {
    //   ?x rdfs:label "${search}"@en .
    //   ?x rdfs:comment ?comment .
    //   FILTER (lang(?comment) = 'en')
    //   } LIMIT 100
    // `);

    // const queryUrl = `https://dbpedia.org/sparql/?default-graph-uri=${endpoint}&query=${query}&format=json`;

    // const xhr = new XMLHttpRequest();

    // function readyStateChange() {
    //   if (this.readyState === 4) {
    //     const data = JSON.parse(this.responseText);
    //     const bindings = data.results.bindings;
    //     if (bindings && bindings.length > 0) {
    //       self.setState({ loading: false, result: bindings[0].comment.value });
    //     } else {
    //       self.setState({ loading: false, result: 'Not found.' });
    //     }
    //   }
    // }

    // xhr.addEventListener('readystatechange', readyStateChange);

    // xhr.open('POST', queryUrl);
    // xhr.send();

    const url = 'https://gateway.watsonplatform.net/assistant/api/v1/workspaces/ea9a8569-e4e0-46be-9440-5ba98465d915/message?version=2018-09-20';
    const userAuth = '01c1efab-67b8-4952-8bd3-214ed36c36dd' + ':' + 'uibLNrVJ8ciY';
    const apiAuth = 'Basic ' + btoa(userAuth);
    const { steps } = this.props;
    const chatInput = steps.search.value;
    fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: apiAuth,
      },
      body: JSON.stringify({
        "input": {
          "text": chatInput
        }
      }),
    })
      .then(res => res.json())
      .then((res) => {
        console.log(res)
        let replyText = res.output.text[0];
        if (res.entities && res.entities.length > 0) {
          var matches = res.output.text[0].match(/\[(.*?)\]/);
          if (matches) {
            var submatch = matches[1];
            this.setState({
              loading: false,
              results: res.entities, //submatch.split('<br>'),
              result: res.output.text[0].replace(matches[1], '').slice(0, -2),
              trigger: true,
            }, () => {
              this.props.triggerNextStep();
            });
          }
        }
        else {
          this.setState({
            loading: false,
            result: replyText,
          });
        }
      });
  }

  triggetNext() {
    this.setState({ trigger: true }, () => {
      this.props.triggerNextStep();
    });
  }

  sentenceCase(str) {
    if ((str === null) || (str === ''))
      return false;
    else
      str = str.toString();

    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  }

  render() {
    const { trigger, loading, result, results } = this.state;

    if (results.length > 0) {
      return (
        <div className="chatbot">
          <p className="chatbot-result-title"> {result} </p>
          {
            results.map(resultsEntry => (
              <div className="chatbot-results">
                <a href="https://www.dropbox.com/sh/w4zeyp7m65qlapw/AAA5iG_qfUkJ3lrS0yR0hj6aa?dl=0&preview=VESTRI_ROADSTER_CARBON_FIBER_SPOILER.usdz" rel="ar">
                  <img
                    src={"https://s3-us-west-2.amazonaws.com/ep-demo-images/VESTRI_VIRTUAL/%sku%.png".replace('%sku%', resultsEntry.value)}
                    onError={(e) => { e.target.src = imgPlaceholder; }}
                    alt="default"
                    className="category-item-thumbnail img-responsive"
                    title=""
                  />
                </a>
                <label>
                  {this.sentenceCase(resultsEntry.value.replace(/_/g, ' '))}
                </label>
              </div>
            ))
          }
          {/* <div
            style={{
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            {
              !trigger &&
              <button
                onClick={() => this.triggetNext()}
              >
                Search Again
            </button>
            }
          </div> */}
        </div>
      );
    }
    else {
      return (
        <div className="dbpedia"
          style={{
            color: '#000',
          }}>
          {loading ? <Loading /> : result}
          {
            !loading &&
            <div
              style={{
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              {
                !trigger &&
                <button
                  onClick={() => this.triggetNext()}
                >
                  Search Again
            </button>
              }
            </div>
          }
        </div>
      );
    }
  }
}

DBPedia.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
};

DBPedia.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
};

const theme = {
  background: '#f5f8fb',
  fontFamily: 'Helvetica Neue',
  headerBgColor: '#40b1f3',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#40b1f3',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

const ExampleDBPedia = () => (
  <ThemeProvider theme={theme}>
    <ChatBot
      floating
      hideBotAvatar
      steps={[
        {
          id: '1',
          message: 'Type something to search on Cortex using Watson. (Ex.: find black shoes)',
          trigger: 'search',
        },
        {
          id: 'search',
          user: true,
          trigger: '3',
        },
        {
          id: '3',
          component: <DBPedia />,
          waitAction: true,
          trigger: '1',
        },
      ]}
    />
  </ThemeProvider>
);

export default ExampleDBPedia;
