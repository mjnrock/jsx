//? https://www.npmjs.com/package/jsx-render
//? https://gist.github.com/sergiodxa/a493c98b7884128081bb9a281952ef33

function dom(tag, _attrs, ...children) {
    const attrs = _attrs || {};
    const props  = {
        _debug: Date.now,
        children: children,
        ...attrs
    };

    // Custom Components will be functions
    if(tag.isClass) {
        let t = new tag(props);

        try {
            return t.render(props);
        } catch(e) {
            throw new Error("Component must have a valid `render` method");
        }
    } else if (typeof tag === "function") {
        return tag(props);
    }
    
    // regular html tags will be strings to create the elements
    if (typeof tag === "string") {
        // fragments to append multiple children to the initial node
        const fragments = document.createDocumentFragment();
        const element = document.createElement(tag);

        children.forEach(child => {
            let result = convert(child);
            appendFragment(fragments, result);
        });

        if("ref" in attrs) {
            if(typeof attrs.ref === "function") {
                attrs.ref(element);
            }
        }

        element.appendChild(fragments);
        // Merge element with attributes
        Object.assign(element, attrs);
        
        return element;
    }
}

function appendFragment(fragments, result) {
    if(result.nodeType === Node.TEXT_NODE || result.nodeType === Node.ELEMENT_NODE) {
        fragments.appendChild(result);
    } else if(Array.isArray(result)) {
        for(let res of result) {
            this.appendFragment(fragments, res);
        }
    }

    return fragments;
}
function convert(input) {
    if (input instanceof HTMLElement) {
        return input;
    } else if (typeof input === "string" || typeof input === "number") {
        return document.createTextNode(input.toString());
    } else if(Array.isArray(input)) {
        return input.map(inp => convert(inp));
    } else if(typeof input === "function") {
        return convert(input());
    }
}

// Component functions receive @props when rendered
function Fragment(props) {
    return props.children;
}

function Headline(props) {
    cat = () => console.log(Date.now());

    return (
        <h1 className="headline">
            <button onclick={ cat }>{ props.title }</button>
            Inital Line
            <br />
            new line
        </h1>
    )
}

class Component {
    static isClass = true;  // Used as a flag for the `.dom(...)` method to determine if the class extends from the JSX project lineage

    constructor(props, state = {}) {
        this.props = props;
        this._state = this.getInitialState(props, state);

        // return new Proxy(this, {
        //     // TODO
        // })
    }
    
    get state() {
        return this._state;
    }
    set state(state) {
        this._state = state;
        
        this.onUpdate(state);
    }

    getInitialState(props, state = {}) {
        return {};
    }

    onUpdate(newState) {}

    render() {
        return (
            <h1>*** YOU FORGOT TO ADD A RENDER METHOD ***</h1>
        );
    }
}

class TestComponent extends Component {
    render() {
        return (
            <Fragment>
                <Fragment>
                    <div>Test Render Method START</div>
                    <div>{ this.props.test }</div>
                    <div>{ this.props._debug() }</div>
                    <div>Test Render Method END</div>
                </Fragment>
            </Fragment>
        );
    }
}

function Main() {
    return (
        <div>

            {/* TEST [SUCCEED]: Nested <Fragment> now work as expected */}
            <Fragment>
                <Fragment>
                    <Fragment>

                        {/* TEST [SUCCEED]: A function component renders and properly receives a custom attribute */}
                        <Headline title={ `Prop Test` } />
                        
                        {/* TEST [SUCCEED]: A class component renders properly and properly receives a custom attribute */}
                        <TestComponent test={ `YESH!` } />
                        
                        {/* TEST [SUCCEED]: A normal element renders properly */}
                        <p>Lorem ipsum</p>

                        {/* TEST [SUCCEED]: A ternary function renders properly */}
                        <p>{ Math.random() > 0.5 ? "YES" : "NO" }</p>
                        
                        {/* TEST [SUCCEED]: A called function renders properly */}
                        <p>{ Date.now() }</p>

                        {/* TEST [SUCCEED]: An uncalled function renders properly */}
                        <p>{ Date.now }</p>
                        
                        <p>WOOOO!</p>

                        {/* TEST [SUCCEED]: Array.map() renders properly */}
                        <ol> { [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ].map(item => <li>{ item }</li>) } </ol>

                        {/* TEST [SUCCEED]: @ref works properly */}
                        <button ref={ node => { 
                            node.addEventListener("click", replaceElement);
                        }}>Refresh View</button>

                        <ul>
                            {/* TEST [SUCCEED]: A NATIVE DOM event is bound correctly */}
                            <li><button onclick={ () => alert("Hello") }>Click Me</button></li>
                            <li><a href="">anchor</a></li>
                            <li>2</li>
                            <li><a href="">anchor2</a> More</li>
                            <li>
                                <ul>
                                    <li><button onclick={ () => alert("Hello") }>Click Me</button></li>
                                    <li><a href="">anchor</a></li>
                                    <li>2</li>
                                    <li><a href="">anchor2</a> More</li>
                                    <li>
                                        <ul>
                                            <li><button onclick={ () => alert("Hello") }>Click Me</button></li>
                                            <li><a href="">anchor</a></li>
                                            <li>2</li>
                                            <li><a href="">anchor2</a> More</li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </Fragment>
                </Fragment>
            </Fragment>
        </div>
    );
}

function replaceElement() {
    {/* TEST [SUCCEED]: The main entry point is properly replaced by an "update" */}
    app.replaceChild(Main(), app.lastChild);
}


{/* TEST [SUCCEED]: Expected updates happen at interval */}
// setInterval(() => replaceElement(), 1000);

const app = document.querySelector("#app");
const child = app.appendChild(Main());