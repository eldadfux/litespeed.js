
var view = require('view');

view.add({
    name: 'ls-loop',
    selector: 'data-ls-loop',
    template: false,
    controller: function(element) {

        var reference   = element.dataset['lsLoop'].replace('[\'', '.').replace('\']', '').split('.'), // Make syntax consistent using only dot nesting
            template    = element.innerHTML,
            service     = container.get(reference.shift()),
            path        = reference.join('.'),
            array       = Object.path(service, path),
            watch       = Object.path(service, path, undefined, true),
            render      = function(element, array) {
                var output = '';

                for (var i = 0; i < array.length; i++) {
                    //console.log(template);
                    output += template
                        .replace(/{{ /g, '{{')
                        .replace(/ }}/g, '}}')
                        .replace(/{{value}}/g, array[i])
                        .replace(/{{key}}/g, i)
                    ;
                }

                element.innerHTML = output;
            }
        ;

        if(typeof array !== 'array' && typeof array !== 'object') {
            throw new Error('Reference \'' + path + '\' value must be array or object. ' + (typeof array) + ' given');
        }

        render(element, array);

        Object.observe(watch, function(changes) {
            render(element, array);
        });

        var dragSrcEl = null;

        function handleDragStart(e) {
            // Target (this) element is the source node.
            this.style.opacity = '0.4';

            dragSrcEl = this;

            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
        }

        function handleDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault(); // Necessary. Allows us to drop.
            }

            e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

            return false;
        }

        function handleDragEnter(e) {
            // this / e.target is the current hover target.
            this.classList.add('over');
        }

        function handleDragLeave(e) {
            this.classList.remove('over');  // this / e.target is previous target element.
        }

        function handleDrop(e) {
            // this/e.target is current target element.

            if (e.stopPropagation) {
                e.stopPropagation(); // Stops some browsers from redirecting.
            }

            // Don't do anything if dropping the same column we're dragging.
            if (dragSrcEl != this) {
                // Set the source column's HTML to the HTML of the column we dropped on.
                dragSrcEl.innerHTML = this.innerHTML;
                this.innerHTML = e.dataTransfer.getData('text/html');
            }

            return false;
        }

        function handleDragEnd(e) {
            this.style.opacity = '1';

            // this/e.target is the source node.

            [].forEach.call(element.children, function (node) {
                node.classList.remove('over');
            });
        }

        var start = function() {
            [].forEach.call(element.children, function(node) {
                node.addEventListener('dragstart',  handleDragStart, false);
                node.addEventListener('dragenter',  handleDragEnter, false);
                node.addEventListener('dragover',   handleDragOver, false);
                node.addEventListener('dragleave',  handleDragLeave, false);
                node.addEventListener('drop',       handleDrop, false);
                node.addEventListener('dragend',    handleDragEnd, false);
            });
        };

        start();
    }
});