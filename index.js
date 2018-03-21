const lib = require('./lib');
const get = require('lodash/get');
const pretty = require('pretty');

module.exports = {

    // Extend ebook resources and html
    website: {
        assets: "./book",
        js: [
            'class-list.pollyfill.js',
            "code.group.js"
        ],
        css: [
            "code.group.css"
        ],
    },

    // Extend templating blocks
    blocks: {
        // output sample https://codepen.io/anon/pen/GxWPaN
        codegroup: {
            blocks: ['codetab'],
            process: function (codeGroup) {
                var tasks = codeGroup.blocks.map((block, i) => {
                    const item = lib.parseBlock(block.body)[0];
                    const descriptor = get(item, 'lang');
                    const tabName = block.args.length == 0 ? descriptor : block.args[0];
                    const tabId = `${descriptor}-${i}-${lib.getHash()}`;
                    const selectorId = `select-${tabId}`;
                    const active = i === 0 ? ' gbcg-active' : '';
                    return this.renderBlock('markdown', block.body)
                        .then(function (str) {
                            return {
                                tabId,
                                selectorId,
                                tabContent: `<div id="${tabId}" class="gbcg-tab-item gbcb-${tabName}">\n${str}</div>`,
                                tabSelector: `<a class="gbcg-selector gbcg-clearfix${active}" data-tab="${tabId}" onclick="codeGroup.showtab(event)">${tabName}</a>`,
                                tabName,
                                parsedBlock: item,
                            };
                        })

                });

                return Promise.all(tasks).then((tabs) => {
                    const content = lib.getTabContents(tabs);
                    const selectors = lib.getTabSelectors(tabs);
                    return pretty(`<div class="gbcg-codegroup">
                        <div class="gbcg-tab-selectors">
                            ${selectors}
                        </div>
                        <div class="gbcg-tab-contents">
                            <div id="gbcg-tab-container"> ${tabs[0].tabContent}</div>
                            <div class="gbcg-tab-item-cntr">
                                ${content}
                            </div>
                        </div>
                    </div>`);
                })
            }
        }
    },

    // Extend templating filters
    filters: {
        // Author will be able to write "{{ 'test'|myFilter }}"
        myFilter: function(s) {
            return "Hello "+s;
        }
    },

    // Hook process during build
    hooks: {
        // For all the hooks, this represent the current generator

        // This is called before the book is generated
        "init": function() {
            console.log("init!");
        },

        // This is called after the book generation
        "finish": function() {
            console.log("finish!");
        }
    }
};
