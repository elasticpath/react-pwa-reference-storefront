import React from 'react';
import queryString from 'query-string';

const Config = require('Config');





class WriteReview extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
  
     const { location, history } = this.props;
    const url = location.search;
    const params = queryString.parse(url);

    var productCode = params.pr_page_id;

    console.log("url: " + url);
    console.log("displayong write review page for product: " + productCode);

    POWERREVIEWS.display.render({
      api_key: Config.PowerReviews.api_key,
      locale: 'en_US',
      merchant_group_id: Config.PowerReviews.merchant_group_id,
      merchant_id: Config.PowerReviews.merchant_id,
      review_wrapper_url: '/write-a-review/',
      page_id: productCode,
      components: {
        Write: 'pr-write',
      }
    });
  }

  render() {
    return <div id='pr-write'></div>
  }
}

export default WriteReview;