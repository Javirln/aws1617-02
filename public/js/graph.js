function createGraph(dataset) {
    var svg = d3.select("#graph").append("svg").attr({
        "width": $("#graph").width(),
        "height": 500
    });

    var force = d3.layout.force()
        .nodes(dataset.nodes)
        .links(dataset.edges)
        .size([$("#graph").width(), 500])
        .linkDistance([200])
        .charge([-500])
        .theta(0.1)
        .gravity(0.05)
        .start();

    var edges = svg.selectAll("line")
        .data(dataset.edges)
        .enter()
        .append("line")
        .attr("id", function(d, i) {
            return 'edge' + i
        })
        .attr('marker-end', 'url(#arrowhead)')
        .style("stroke", "#ccc")
        .style("pointer-events", "none");

    var nodes = svg.selectAll("circle")
        .data(dataset.nodes)
        .enter()
        .append("circle")
        .attr({
            "r": function(d) {
                return whichRadius(d.type);
            }
        })
        .style("fill", function(d, i) {
            return whichColor(d.type);
        })
        .call(force.drag)

    nodes.on("dblclick", function(d) {
        console.log("Double click on node " + d.name);
        loadInfo(d);
    });

    var nodelabels = svg.selectAll(".nodelabel")
        .data(dataset.nodes)
        .enter()
        .append("text")
        .attr({
            "x": function(d) {
                return d.x;
            },
            "y": function(d) {
                return d.y;
            },
            "class": "nodelabel",
            "font-size": function(d) {
                return whichSize(d.type);
            }
        })
        .text(function(d) {
            return d.abb;
        });

    var edgepaths = svg.selectAll(".edgepath")
        .data(dataset.edges)
        .enter()
        .append('path')
        .attr({
            'd': function(d) {
                return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
            },
            'class': 'edgepath',
            'fill-opacity': 0,
            'stroke-opacity': 0,
            'fill': 'blue',
            'stroke': 'red',
            'id': function(d, i) {
                return 'edgepath' + i
            }
        })
        .style("pointer-events", "none");

    var edgelabels = svg.selectAll(".edgelabel")
        .data(dataset.edges)
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attr({
            'class': 'edgelabel',
            'id': function(d, i) {
                return 'edgelabel' + i
            },
            'dx': 80,
            'dy': 0,
            'font-size': 10,
            'fill': '#aaa'
        });

    edgelabels.append('textPath')
        .attr('xlink:href', function(d, i) {
            return '#edgepath' + i
        })
        .style("pointer-events", "none");
    /*.text(function(d, i) {
            return whichLabel(dataset.edges[i]);
          });*/


    svg.append('defs').append('marker')
        .attr({
            'id': 'arrowhead',
            'viewBox': '-0 -5 10 10',
            'refX': 25,
            'refY': 0,
            'orient': 'auto',
            'markerWidth': 10,
            'markerHeight': 10,
            'xoverflow': 'visible'
        })
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#ccc')
        .attr('stroke', '#ccc');


    force.on("tick", function() {

        edges.attr({
            "x1": function(d) {
                return d.source.x;
            },
            "y1": function(d) {
                return d.source.y;
            },
            "x2": function(d) {
                return d.target.x;
            },
            "y2": function(d) {
                return d.target.y;
            }
        });

        nodes.attr({
            "cx": function(d) {
                return d.x;
            },
            "cy": function(d) {
                return d.y;
            }
        });

        nodelabels.attr("x", function(d) {
                return d.x - d.difference; //(getWidthOfText(d.abb, "Arial, Helvetica, sans-serif", whichSize(d.type))));//d.x - (whichRadius(d.type)); //(20 + (5 * (5 - d.type)));
            })
            .attr("y", function(d) {
                return d.y + 7;
            });

        edgepaths.attr('d', function(d) {
            var path = 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
            return path
        });

        edgelabels.attr('transform', function(d, i) {
            if (d.target.x < d.source.x) {
                bbox = this.getBBox();
                rx = bbox.x + bbox.width / 2;
                ry = bbox.y + bbox.height / 2;
                return 'rotate(180 ' + rx + ' ' + ry + ')';
            }
            else {
                return 'rotate(0)';
            }
        });
    });

}

function whichColor(type) {
    switch (type) {
        case 1:
            return "#509eff";
            break;
        case 2:
            return "#ffb750";
            break;
        case 3:
            return "#ff5050";
            break;
        case 4:
            return "#69ff50";
            break;
        default:
            return "#69ff50";
            break;
    }
}

function whichRadius(type) {
    return (55 - (type * 5));
}

function whichSize(type) {
    return (40 - (type * 5));
}

function whichLabel(arrow) {
    console.log("Source: " + JSON.stringify(arrow.source) + " Target: " + JSON.stringify(arrow.target));
    return "FLECHA";
}

function loadInfo(d) {
    $("#modal-papers").empty();
    if (d.type != 4) {
        $("#load-papers").hide();
    }
    else {
        $("#load-papers").show();
    }
    switch (d.type) {
        case 1:
            //University
            $("#modal-header").html("<b>University</b> | " + d.name);
            var acronym = d.acronym;
            console.log("Invoking https://aws1617-04.herokuapp.com/api/v1/universities/" + acronym);
            $.get(
                "https://aws1617-04.herokuapp.com/api/v1/universities/" + acronym, {},
                function(data) {
                    $("#modal-body").html("<div class=\"row\"><div class=\"col-lg-3\"><img src=\"" + data.logo + "\" style=\"height: 150; padding: 10px;\"/></div><div class=\"col-lg-9\"><b>Name:</b> " + data.name + "<br><b>Acronym:</b> " + data.acronym + "<br><b>URL:</b> <a href=\"" + data.url + "\">" + data.url + "</a></div></div><hr><h4><b>Tweets</b></h4><div id=\"tweets\"></div></div>");
                }
            );
            getTweets("Universidad de Sevilla");
            break;
        case 2:
            //Group
            $("#modal-header").html("<b>Researcher Group</b> | " + d.name);
            var id = d.id;
            console.log("Invoking https://aws1617-dcp-sandbox-aws1617dcp.c9users.io/api/v1/groups/" + id);
            $.get(
                "https://aws1617-dcp-sandbox-aws1617dcp.c9users.io/api/v1/groups/" + id, {},
                function(data) {
                    $("#modal-body").html("<b>Name:</b> " + data.name + "<br><b>Description:</b> " + data.description + "<br>");
                }
            );
            break;
        case 3:
            //Project
            $("#modal-header").html("<b>Researcher Project</b> | " + d.name);
            var id = d.id;
            console.log("Invoking https://aws1617-01.herokuapp.com/api/v1/projects/" + id);
            $.get(
                "https://aws1617-01.herokuapp.com/api/v1/projects/" + id, {},
                function(data) {
                    $("#modal-body").html("<b>Title:</b> " + data[0].titulo + "<br><b>Summary:</b> " + data[0].resumen + "<br><b>Goal:</b> " + data[0].objetivo + "<br><b>Foundation:</b> " + data[0].presupuesto + "€<br>");
                }
            );
            break;
        case 4:
            //Researcher
            $("#modal-header").html("<b>Researcher</b> | " + d.name);
            var orcid = d.orcid;
            console.log("Invoking https://aws1617-02.herokuapp.com/api/v1/researchers/" + orcid);

            $.ajax({
                type: 'GET',
                url: 'https://aws1617-02.herokuapp.com/api/v1/researchers/' + orcid,
                headers: {
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTI3NjYyMjQsImV4cCI6MTQ5Mzk3NTgyNH0.WExNusVFHUcM6LKCwp3cz2SudqM1-CWF3DCZZIPNF-E '
                },
                success: function(data, textStatus, request) {
                    $("#modal-body").html("<b>ORCID:</b> " + data[0].orcid + "<br><b>Name:</b> " + data[0].name + "<br><b>Phone:</b> " + data[0].phone + "<br><b>Email: </b><a href=\"mailto:" + data[0].email + "\">" + data[0].email + "</a><br><b>Address:</b> " + data[0].address + "<br><b>Gender: </b>" + data[0].gender + "<br>");
                }
            });

            $("#load-papers").click(function() {
                $.get(
                    "https://api.elsevier.com/content/search/author?query=orcid(" + orcid + ")&apiKey=c3fc66dd92e97d5b54e49a58e001bdb1", {},
                    function(data) {
                        var auid = data["search-results"].entry[0]["dc:identifier"];
                        auid = auid.substring(10, auid.length);
                        $.get(
                            "https://api.elsevier.com/content/search/scopus?query=au-id(" + auid + ")&apiKey=c3fc66dd92e97d5b54e49a58e001bdb1", {},
                            function(data) {
                                var papers = "<ul>";
                                for (var i = 0; i < data["search-results"].entry.length; i++) {
                                    var entry = data["search-results"].entry[i];
                                    papers += "<li><b><a href=https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=\"" + entry["eid"].substring(7, entry["eid"].length) + "\">" + entry["dc:title"] + "</a></b><ul><li>" + entry["prism:publicationName"] + "</li><li>Cited by " + entry["citedby-count"] + "</li></ul></li>";
                                    if (i == 5)
                                        break;
                                }
                                $("#modal-papers").html(papers + "</ul>");
                            }
                        );
                    }
                );
            });
            break;
        default:
            break;
    }
    $("#myModal").modal();
}

function getWidthOfText(txt, fontname, fontsize) {
    // Create a dummy canvas (render invisible with css)
    var c = document.createElement('canvas');
    // Get the context of the dummy canvas
    var ctx = c.getContext('2d');
    // Set the context.font to the font that you are using
    ctx.font = fontsize + fontname;
    // Measure the string 
    // !!! <CRUCIAL>  !!!
    var length = ctx.measureText(txt).width;
    // !!! </CRUCIAL> !!!
    // Return width
    return 1.2 * length;
}

function loadResources() {
    var responses = {
        researchers: [],
        projects: [],
        groups: [],
        universities: []
    }
    var dataset = {
        nodes: [],
        edges: []
    };
    var promises = [];

    console.log("Invoking https://aws1617-04.herokuapp.com/api/v1/universities");
    var request = $.get(
        "https://aws1617-04.herokuapp.com/api/v1/universities", {},
        function(data) {
            responses.universities = data;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var university = data[key];
                    var abb = getCapitals(university.name);
                    dataset.nodes.push({
                        acronym: university.acronym,
                        name: university.name,
                        abb: abb,
                        difference: getWidthOfText(abb, "Arial, Helvetica, sans-serif", whichSize(1)),
                        type: 1
                    });
                }
            }
        }
    );

    promises.push(request);

    console.log("Invoking https://aws1617-dcp-sandbox-aws1617dcp.c9users.io/api/v1/groups/");
    request = $.get(
        "https://aws1617-dcp-sandbox-aws1617dcp.c9users.io/api/v1/groups/", {},
        function(data) {
            responses.groups = data;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var group = data[key];
                    var abb = getCapitals(group.name);
                    dataset.nodes.push({
                        id: group.id,
                        name: group.name,
                        abb: abb,
                        difference: getWidthOfText(abb, "Arial, Helvetica, sans-serif", whichSize(2)),
                        type: 2
                    });
                }
            }
        }
    );

    promises.push(request);

    console.log("Invoking https://aws1617-01.herokuapp.com/api/v1/projects");
    request = $.get(
        "https://aws1617-01.herokuapp.com/api/v1/projects", {},
        function(data) {
            for (var key in data) {
                responses.projects = data;
                if (data.hasOwnProperty(key)) {
                    var project = data[key];
                    var abb = getCapitals(project.titulo);
                    dataset.nodes.push({
                        id: parseInt(project.id),
                        name: project.titulo,
                        abb: abb,
                        difference: getWidthOfText(abb, "Arial, Helvetica, sans-serif", whichSize(3)),
                        type: 3
                    });
                }
            }
        }
    );

    promises.push(request);

    console.log("Invoking https://aws1617-02.herokuapp.com/api/v1/researchers/");
    request = $.ajax({
        type: 'GET',
        url: 'https://aws1617-02.herokuapp.com/api/v1/researchers/',
        headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTI3NjYyMjQsImV4cCI6MTQ5Mzk3NTgyNH0.WExNusVFHUcM6LKCwp3cz2SudqM1-CWF3DCZZIPNF-E '
        },
        success: function(data, textStatus, request) {
            responses.researchers = data;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var researcher = data[key];
                    var abb = getCapitals(researcher.name);
                    dataset.nodes.push({
                        orcid: researcher.orcid,
                        name: researcher.name,
                        abb: abb,
                        difference: getWidthOfText(abb, "Arial, Helvetica, sans-serif", whichSize(4)),
                        type: 4
                    });
                }
            }
        }
    });

    promises.push(request);

    $.when.apply(null, promises).done(function() {
        loadEdges(responses, dataset);
    });
}

function loadEdges(responses, dataset) {
    console.log("All nodes loaded! Staring with edges...");
    //Researchers
    for (var key in responses.researchers) {
        if (responses.researchers.hasOwnProperty(key)) {
            var id_projects = responses.researchers[key].projects;
            for (var i in id_projects) {
                var indexT = -1,
                    indexS = -1;
                dataset.nodes.find(function(item, j) {
                    if (item.orcid === responses.researchers[key].orcid && item.type === 4) {
                        indexS = j;
                    }
                });
                dataset.nodes.find(function(item, j) {
                    if (item.id === id_projects[i] && item.type === 3) {
                        indexT = j;
                    }
                });
                dataset.edges.push({
                    source: indexS,
                    target: indexT
                });
            }
        }
    }

    //Projects
    for (var key in responses.projects) {
        if (responses.projects.hasOwnProperty(key)) {
            var id_group = parseInt(responses.projects[key].grupo);
            dataset.nodes.find(function(item, j) {
                if (item.id === parseInt(responses.projects[key].id) && item.type === 3) {
                    indexS = j;
                }
            });
            dataset.nodes.find(function(item, j) {
                if (item.id === id_group && item.type === 2) {
                    indexT = j;
                }
            });
            dataset.edges.push({
                source: indexS,
                target: indexT
            });
        }
    }

    //Groups
    for (var key in responses.groups) {
        if (responses.groups.hasOwnProperty(key)) {
            var id_university = responses.groups[key].university;
            dataset.nodes.find(function(item, j) {
                if (item.acronym === id_university && item.type === 1) {
                    indexT = j;
                }
            });
            dataset.nodes.find(function(item, j) {
                if (item.id === responses.groups[key].id && item.type === 2) {
                    indexS = j;
                }
            });
            dataset.edges.push({
                source: indexS,
                target: indexT
            });
        }
    }

    createGraph(dataset);

}

function getCapitals(input) {
    var response = "";
    for (var i = 0; i < input.length; i++) {
        if (input.charAt(i) === input.charAt(i).toUpperCase() && input.charAt(i) != " ") {
            response += input.charAt(i) + ".";
        }
        if (response.length == 6)
            return response;
    }
    return response;
}

function getTweets(query) {
    $.get("/api/v1/tweets/" + query, {},
        function(data) {
            var text = "";
            var tweets = data.statuses;

            for (var i in tweets) {
                twttr.widgets.createTweet(
                        tweets[i].id_str,
                        document.getElementById('tweets'), {
                            align: 'left'
                        })
                    .then(function(el) {
                        console.log("Tweet displayed.");
                    });
                if (i == 5)
                    break;
            }

            $("#tweets").html(text);
        }
    );
}
