const AST = require('idyll-ast');
var getRepoInfo = require('git-repo-info');
var d3 = require("d3");
require("d3-time-format");
var remoteOriginUrl = require('remote-origin-url');

var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
var formatTime = d3.timeFormat("%B %e, %Y");

module.exports = (ast) => {
    var url = remoteOriginUrl.sync();
    var info = getRepoInfo();
    let elements = [];
    elements.push(AST.createNode('span', { id: 'revisionTitle' }, ['Revision: ']));

    let commitUrl = '';
    let commitText = '';
    if (info.commitMessage !== null) {
        commitText = info.commitMessage;
    }
    else if (info.abbreviatedSha !== null) {
        commitText = info.abbreviatedSha;
    }
    if (url === undefined) {
        url = '';
    }
    else {
        console.log('url', url);
        url = url.split('.git')[0];
        if (!url.includes("http") && url.includes("git@")) {
            url = "https://" + url.split('git@')[1].replace(':', '/');
        }
        commitUrl = url + '/commit/' + info.sha;
    }
    elements.push(AST.createNode('a', { href: commitUrl, id: 'revisionMessage' }, [commitText]));

    if (info.committer !== null) {
        let author = info.committer.split('<')[0];
        elements.push(AST.createNode('span', { id: 'revisionAuthor' }, [' by ' + author]));
    }

    if (info.committerDate !== null) {
        elements.push(AST.createNode('span', { id: 'revisionDate' }, [' on ' + formatTime(parseTime(info.committerDate))]));
    }

    let revisionDiv = AST.createNode('div', { id: 'revisionDiv' }, elements);
    let ASTwithRevision = AST.modifyNodesByName(ast, 'Revision', (node) => {
        return revisionDiv;
    });
    return ASTwithRevision;
};