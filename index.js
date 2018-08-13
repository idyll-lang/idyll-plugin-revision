const AST = require('idyll-ast');
var getRepoInfo = require('git-repo-info');
var d3 = require("d3");
require("d3-time-format");
var remoteOriginUrl = require('remote-origin-url');

var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
var formatTime = d3.timeFormat("%B %e, %Y");

module.exports = (ast) => {
    remoteOriginUrl(function (err, url) {
        var info = getRepoInfo();
        let elements = [];
        elements.push(AST.createNode('span', { id: 'revisionTitle' }, ['Revision: ']));
        let commitUrl = '';
        if (err) {
            console.log(err);
            url = '';
        }
        else {
            console.log(url);
            url = url.split('.git')[0];
            if (!url.includes("http") && url.includes("git@")) {
                url = "https://" + url.split('git@')[1].replace(':', '/');
            }
            commitUrl = url + '/commit/' + info.sha;
        }
        elements.push(AST.createNode('a', { href: commitUrl, id: 'revisionMessage' }, [info.commitMessage]));
        let author = info.committer.split('<')[0];
        elements.push(AST.createNode('span', { id: 'revisionAuthor' }, [' by ' + author]));
        elements.push(AST.createNode('span', { id: 'revisionDate' }, [' on ' + formatTime(parseTime(info.committerDate))]));
        let revisionDiv = AST.createNode('div', { id: 'revisionDiv' }, elements);
        let ASTwithRevision = AST.modifyNodesByName(ast, 'Revision', (node) => {
            return revisionDiv;
        });
        return ASTwithRevision;
    });
};