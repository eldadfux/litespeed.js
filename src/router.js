var router=function(){var t=[];return{state:function(r,n,o){if("string"!=typeof r)throw new Error("var path must be of type string");if("string"!=typeof n)throw new Error("var template must be of type string");if("function"!=typeof o)throw new Error("var controller must be of type function");return t[t.length++]={path:r,template:n,controller:o},this},match:function(){return t.forEach(function(r){var n=new RegExp(window.location.origin+r.path.replace(/:[^\s/]+/g,"([\\w-]+)")),o=window.location.href;return console.log(o.match(n)),o.match(n)?r:t.firstChild?t.firstChild:null})}}}();