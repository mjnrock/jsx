function dom(tag, attrs, ...children) {
  // Custom Components will be functions
  if (typeof tag === "function") {
    return tag.call(Object.assign(tag, {
      children: children,
      props: Object.assign({}, attrs)
    }));
  }

  attrs = attrs || {}; // regular html tags will be strings to create the elements

  if (typeof tag === "string") {
    // fragments to append multiple children to the initial node
    const fragments = document.createDocumentFragment();
    const element = document.createElement(tag);
    children.forEach(child => {
      let result = convert(child);

      if (result.nodeType === Node.TEXT_NODE || result.nodeType === Node.ELEMENT_NODE) {
        fragments.appendChild(result);
      } else if (Array.isArray(result)) {
        fragments.append(...result);
      }
    });

    if ("ref" in attrs) {
      if (typeof attrs.ref === "function") {
        attrs.ref(element);
      }
    }

    element.appendChild(fragments); // Merge element with attributes

    Object.assign(element, attrs);
    return element;
  }
}

function convert(input) {
  if (input instanceof HTMLElement) {
    return input;
  } else if (typeof input === "string" || typeof input === "number") {
    return document.createTextNode(input.toString());
  } else if (Array.isArray(input)) {
    return input.map(inp => convert(inp));
  } else if (typeof input === "function") {
    return convert(input());
  }
}

function Fragment() {
  return this.children;
}

function Headline() {
  bob = () => console.log(Date.now());

  return dom("h1", {
    className: "headline"
  }, dom("button", {
    onclick: bob
  }, "Prop Test"), "Inital Line", dom("br", null), "new line");
}

function Main() {
  return dom("div", null, dom(Fragment, null, dom(Headline, null), dom("p", null, "Lorem ipsum"), dom("p", null, Date.now), dom("p", null, "WOOOO!"), dom("ol", null, " ", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => dom("li", null, item)), " "), dom("button", {
    ref: node => {
      node.addEventListener("click", replaceElement);
    }
  }, "Refresh View"), dom("ul", null, dom("li", null, dom("button", {
    onclick: () => alert("Hello")
  }, "Click Me")), dom("li", null, dom("a", {
    href: ""
  }, "anchor")), dom("li", null, "2"), dom("li", null, dom("a", {
    href: ""
  }, "anchor2"), " More")))); // return (
  //     <div>
  //         <Fragment>
  //             <Headline />
  //             <p>Lorem ipsum</p>
  //             <p>{ Date.now }</p>
  //                 <p>WOOOO!</p>
  //             <ol> { [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ].map(item => <li>{ item }</li>) } </ol>
  //             <button ref={ node => { 
  //                 node.addEventListener("click", replaceElement);
  //             }}>Refresh View</button>
  //             <ul>
  //                 <li><button onclick={ () => alert("Hello") }>Click Me</button></li>
  //                 <li><a href="">anchor</a></li>
  //                 <li>2</li>
  //                 <li><a href="">anchor2</a> More</li>
  //             </ul>
  //         </Fragment>
  //     </div>
  // )
}

function replaceElement() {
  app.replaceChild(Main(), app.lastChild);
} // setInterval(() => replaceElement(), 1000);


const app = document.querySelector("#app");
const child = app.appendChild(Main());