import React, {Component} from 'react';
import { ComponentOne, ProductItem, Carousel } from '@elasticpath/store-components'

class HomePage extends Component {
    render() {

        return (
            <div className="App">
                <Carousel />
                <header className="App-header">
                    <h1>
                        React monorepo
                    </h1>
                    <h2>Hot Reload Your Workspaces</h2>
                    <div className="components">
                        <ComponentOne a="aaa" />
                        <ProductItem productId="id123" />
                    </div>
                </header>
            </div>
        );
    }
}

export default HomePage;
