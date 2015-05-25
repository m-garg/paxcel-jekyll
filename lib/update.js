/**
 * Various functions to update team member.
 * @module base
 * @submodule update
 */
var inquirer = require("inquirer");
var file = require("./file.js");
var yaml = require("js-yaml");
/**
 * Various functions to update team member.
 * @class update
 */
var update = module.exports;
/**
 * Update the team member.
 * @method teamMember
 */
update.teamMember = function(callback) {
    var prompts = [{
        name: "teamMemberName",
        message: "Name of team member",
    }, {
        name: "teamMemberPosition",
        message: "Position of team member:",
    }, {
        name: "teamMemberLocation",
        message: "Location of team member"
    }];
    inquirer.prompt(prompts, function(answers) {
        var member = {};
        for (var key in answers) {
            if (answers.hasOwnProperty(key)) {
                console.log(key + " -> " + answers[key]);
                member[key] = answers[key];
            }
        }
        var team = yaml.safeLoad(file.readFile("_data/team.yml"));
        if (team.teamMemberLocation >= team.people.length) {
            console.log("No member found at the location specified. Please enter valid location");
        } else {
            team.people[team.teamMemberLocation].name = member.teamMemberName;
            team.people[team.teamMemberLocation].position = member.teamMemberPosition;
            console.log(team);
            var data = yaml.safeDump(team);
            file.writeFile("_data/team.yml", data);
        }
        if (typeof callback === "function") {
            callback(null);
        }
    });
};