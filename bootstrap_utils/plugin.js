tinymce.PluginManager.requireLangPack('bootstrap-utils', 'fr_FR');

tinymce.PluginManager.add('bootstraputils', function(editor, url) {
    editor.contentCSS.push(url + '/plugin.css');

    /* COLLAPSE */
    editor.on('init', function() {
        editor.formatter.register('bootstrap-collapse-div-format', {
            block: 'div',
            classes: 'collapse',
            attributes: {'id': '%identifier'}
        });
    });

    // FIXME It adds two paragraphs instead of one
    // editor.on('keydown', function(e) {
    //     var divElm = editor.dom.getParent(editor.selection.getNode(), 'div.collapse');
    //
    //     if (!divElm || e.keyCode !== 13 || tinymce.util.VK.metaKeyPressed(e)) {
    //         return ;
    //     }
    //
    //     if (divElm.textContent === "") {
    //         // Change current node to a normal paragraph
    //         e.preventDefault();
    //         e.stopPropagation();
    //         var paragraph = editor.dom.create('p');
    //         paragraph.append(editor.dom.create('br', {'data-mce-bogus': '1'}));
    //         editor.dom.replace(paragraph, divElm);
    //         editor.selection.setNode(paragraph);
    //         editor.nodeChanged();
    //     }
    // });

    editor.addButton('bootstrap-collapse', {
        type: 'menubutton',
        text: 'Collapse',
        icon: false,
        menu: [{
            text: 'Link',
            icon: false,
            stateSelector: 'a[data-toggle=collapse]',
            onclick: function() {
                var data = {};
                var selectedElm = editor.selection.getNode();
                var anchorElm = editor.dom.getParent(selectedElm, 'a[href]');

                data.text = anchorElm ? (anchorElm.innerText || anchorElm.textContent) : editor.selection.getContent({format: 'text'});
                data.identifier = anchorElm ? editor.dom.getAttrib(anchorElm, 'href').substring(1) : '';

                editor.windowManager.open({
                    title: 'Collapse link',
                    data: data,
                    body: [
                        {type: 'textbox', name: 'text', label: 'Text'},
                        {type: 'textbox', name: 'identifier', label: 'Collapse identifier'}
                    ],
                    onsubmit: function(e) {
                        var data = e.data;
                        var linkAttrs = {
                            href: '#' + data.identifier,
                            'data-toggle': 'collapse',
                            'aria-expanded': 'false',
                            'aria-controls': data.identifier
                        };

                        if (anchorElm) {
                            if ("innerText" in anchorElm) {
                                anchorElm.innerText = data.text;
                            } else {
                                anchorElm.textContent = data.text;
                            }
                            editor.dom.setAttribs(anchorElm, linkAttrs);
                            editor.selection.select(anchorElm);
                        } else {
                            editor.insertContent(editor.dom.createHTML('a', linkAttrs, editor.dom.encode(data.text)));
                        }
                    }
                });
            }
        }, {
            text: 'Container',
            icon: false,
            stateSelector: 'div.collapse',
            onclick: function() {
                var data = {};
                var selectedElm = editor.selection.getNode();
                var divElm = editor.dom.getParent(selectedElm, 'div.collapse');

                data.identifier = divElm ? editor.dom.getAttrib(divElm, 'id') : '';
                editor.windowManager.open({
                    title: 'Collapse div',
                    data: data,
                    body: [
                        {type: 'textbox', name: 'identifier', label: 'Collapse identifier'}
                    ],
                    onsubmit: function(e) {
                        var data = e.data;

                        if (divElm) {
                            if (data.identifier) {
                                editor.undoManager.transact(function() {
                                    editor.dom.setAttrib(divElm, 'id', data.identifier);
                                    editor.nodeChanged();
                                });
                            } else {
                                editor.undoManager.transact(function() {
                                    while (divElm.firstChild) {
                                        divElm.parentNode.insertBefore(divElm.firstChild, divElm);
                                    }
                                    editor.dom.remove(divElm);
                                    editor.nodeChanged();
                                });
                            }
                        } else if (data.identifier) {
                            editor.undoManager.transact(function() {
                                var div = editor.dom.create('div', {id: data.identifier, class: 'collapse'});
                                var rng = editor.selection.getRng(true);

                                rng.setStartBefore(rng.startContainer);
                                rng.setEndAfter(rng.endContainer);

                                div.appendChild(rng.extractContents());
                                rng.insertNode(div);
                                editor.nodeChanged();
                            });
                        }
                    }
                });
            }
        }]
    });
});
