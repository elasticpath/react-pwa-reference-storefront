/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */
 
import React from 'react';

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [{ id: 1, name: 'Test', main: {temp: 2} }]
        };
    }
    componentDidMount() {
        fetch('http://api.openweathermap.org/data/2.5/weather?q=Toronto,CA&units=metric&appId=c0c4d7f918abd1b090cf27da8804d6e3')
            .then(res => res.json())
            .then(res => {
                this.setState({
                    products: [res]
                });
            })
            .catch(error => {
                console.log(error)
            });
    }
    renderProducts() {
        return this.state.products.map(product => {
            return (
                <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.main.temp}</td>
                </tr>
            );
        })
    }

    search() {
        fetch('http://api.openweathermap.org/data/2.5/weather?units=metric&appId=c0c4d7f918abd1b090cf27da8804d6e3&q=' + this.refs.keyword.value)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    products: [res]
                });
            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        return (
            <div>
                <h3>Product List</h3>
                <br />
                Product name <input type="text" ref="keyword"/>
                <input type="button" value="Search" onClick={this.search.bind(this)}/>
                <br />
                <br />
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>City</th>
                            <th>Temperature</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderProducts()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Product;