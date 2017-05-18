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
            var id = d.id;
            console.log("Invoking https://aws1617-dcp-sandbox-aws1617dcp.c9users.io/api/v1/universities/" + id);
            $.get(
                "https://aws1617-dcp-sandbox-aws1617dcp.c9users.io/api/v1/universities/" + id, {},
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
            $.get(
                "https://aws1617-02.herokuapp.com/api/v1/researchers/" + orcid, {},
                function(data) {
                    $("#modal-body").html("<b>ORCID:</b> " + data[0].orcid + "<br><b>Name:</b> " + data[0].name + "<br><b>Phone:</b> " + data[0].phone + "<br><b>Email: </b><a href=\"mailto:" + data[0].email + "\">" + data[0].email + "</a><br><b>Address:</b> " + data[0].address + "<br><b>Gender: </b>" + data[0].gender + "<br>");
                }
            );

            $("#load-papers").click(function() {
                //GET CALL TO https://api.elsevier.com/content/search/author?query=orcid(orcid)&apiKey=api_key
                var data = JSON.parse('{"search-results": { "opensearch:totalResults": "1", "opensearch:startIndex": "0", "opensearch:itemsPerPage": "1", "opensearch:Query": { "@role": "request", "@searchTerms": "orcid(0000-0003-1575-406X)", "@startPage": "0" }, "link": [{ "@_fa": "true", "@href": "https://api.elsevier.com/content/search/author?start=0&count=25&query=orcid%280000-0003-1575-406X%29&apiKey=7f59af901d2d86f78a1fd60c1bf9426a", "@ref": "self", "@type": "application/json" }, { "@_fa": "true", "@href": "https://api.elsevier.com/content/search/author?start=0&count=25&query=orcid%280000-0003-1575-406X%29&apiKey=7f59af901d2d86f78a1fd60c1bf9426a", "@ref": "first", "@type": "application/json" }], "entry": [{ "@_fa": "true", "link": [{ "@_fa": "true", "@href": "https://api.elsevier.com/content/author/author_id/15021461000", "@ref": "self" }, { "@_fa": "true", "@href": "https://api.elsevier.com/content/search/author?query=au-id%2815021461000%29", "@ref": "search" }, { "@_fa": "true", "@href": "https://www.scopus.com/author/citedby.uri?partnerID=HzOxMe3b&citedAuthorId=15021461000&origin=inward", "@ref": "scopus-citedby" }, { "@_fa": "true", "@href": "https://www.scopus.com/authid/detail.uri?partnerID=HzOxMe3b&authorId=15021461000&origin=inward", "@ref": "scopus-author" }], "prism:url": "https://api.elsevier.com/content/author/author_id/15021461000", "dc:identifier": "AUTHOR_ID:15021461000", "eid": "9-s2.0-15021461000", "orcid": "0000-0003-1575-406X", "preferred-name": { "surname": "Resinas", "given-name": "Manuel", "initials": "M." }, "name-variant": [{ "@_fa": "true", "surname": "Resinas", "given-name": "M.", "initials": "M." }, { "@_fa": "true", "surname": "Resinas Arias De Reyna", "given-name": "Manuel", "initials": "M." }], "document-count": "47", "subject-area": [{ "@abbrev": "COMP", "@frequency": "63", "$": "Computer Science (all)" }, { "@abbrev": "BUSI", "@frequency": "20", "$": "Business, Management and Accounting (all)" }, { "@abbrev": "MATH", "@frequency": "29", "$": "Mathematics (all)" }], "affiliation-current": { "affiliation-url": "https://api.elsevier.com/content/affiliation/affiliation_id/60033284", "affiliation-id": "60033284", "affiliation-name": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" } }] } }');

                console.log("AUTHOR_ID: " + data["search-results"].entry[0]["dc:identifier"]);

                //GET CALL TO https://api.elsevier.com/content/search/scopus?query=au-id(15021461000)&apiKey=api_key
                data = JSON.parse('{ "search-results": { "opensearch:totalResults": "47", "opensearch:startIndex": "0", "opensearch:itemsPerPage": "25", "opensearch:Query": { "@role": "request", "@searchTerms": "au-id(15021461000)", "@startPage": "0" }, "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/search/scopus?start=0&count=25&query=au-id%2815021461000%29&apiKey=7f59af901d2d86f78a1fd60c1bf9426a", "@type": "application/json" }, { "@_fa": "true", "@ref": "first", "@href": "https://api.elsevier.com/content/search/scopus?start=0&count=25&query=au-id%2815021461000%29&apiKey=7f59af901d2d86f78a1fd60c1bf9426a", "@type": "application/json" }, { "@_fa": "true", "@ref": "next", "@href": "https://api.elsevier.com/content/search/scopus?start=25&count=25&query=au-id%2815021461000%29&apiKey=7f59af901d2d86f78a1fd60c1bf9426a", "@type": "application/json" }, { "@_fa": "true", "@ref": "last", "@href": "https://api.elsevier.com/content/search/scopus?start=22&count=25&query=au-id%2815021461000%29&apiKey=7f59af901d2d86f78a1fd60c1bf9426a", "@type": "application/json" }], "entry": [{ "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/85012241935" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/85012241935?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=85012241935&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=85012241935&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/85012241935", "dc:identifier": "SCOPUS_ID:85012241935", "eid": "2-s2.0-85012241935", "dc:title": "Modeling Service Level Agreements with Linked USDL Agreement", "dc:creator": "García J.", "prism:publicationName": "IEEE Transactions on Services Computing", "prism:issn": "19391374", "prism:volume": "10", "prism:issueIdentifier": "1", "prism:pageRange": "52-65", "prism:coverDate": "2017-01-01", "prism:coverDisplayDate": "January-February 2017", "prism:doi": "10.1109/TSC.2016.2593925", "citedby-count": "0", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Journal", "subtype": "ar", "subtypeDescription": "Article", "article-number": "7519020", "source-id": "18300156728" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84948120472" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84948120472?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84948120472&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84948120472&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84948120472", "dc:identifier": "SCOPUS_ID:84948120472", "eid": "2-s2.0-84948120472", "dc:title": "Using templates and linguistic patterns to define process performance indicators", "dc:creator": "del-Río-Ortega A.", "prism:publicationName": "Enterprise Information Systems", "prism:issn": "17517575", "prism:eIssn": "17517583", "prism:volume": "10", "prism:issueIdentifier": "2", "prism:pageRange": "159-192", "prism:coverDate": "2016-01-01", "prism:coverDisplayDate": "12 February 2016", "prism:doi": "10.1080/17517575.2013.867543", "citedby-count": "1", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Journal", "subtype": "ar", "subtypeDescription": "Article", "source-id": "10900153330" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84988672551" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84988672551?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84988672551&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84988672551&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84988672551", "dc:identifier": "SCOPUS_ID:84988672551", "eid": "2-s2.0-84988672551", "dc:title": "Identifying variability in process performance indicators", "dc:creator": "Estrada-Torres B.", "prism:publicationName": "Lecture Notes in Business Information Processing", "prism:issn": "18651348", "prism:isbn": "9783319454672", "prism:volume": "260", "prism:pageRange": "91-107", "prism:coverDate": "2016-01-01", "prism:coverDisplayDate": "2016", "prism:doi": "10.1007/978-3-319-45468-9_6", "citedby-count": "0", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Book Series", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "17500155101" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84964849319" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84964849319?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84964849319&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84964849319&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84964849319", "dc:identifier": "SCOPUS_ID:84964849319", "eid": "2-s2.0-84964849319", "dc:title": "Introduction to the 2nd workshop on resource management in service-oriented computing (RMSOC) 2015", "dc:creator": "Cabanillas C.", "prism:publicationName": "Lecture Notes in Computer Science (including subseries Lecture Notes in Artificial Intelligence and Lecture Notes in Bioinformatics)", "prism:issn": "03029743", "prism:eIssn": "16113349", "prism:isbn": "9783662505380", "prism:volume": "9586", "prism:pageRange": "XV-XVII", "prism:coverDate": "2016-01-01", "prism:coverDisplayDate": "2016", "citedby-count": "0", "affiliation": [{ "@_fa": "true", "affilname": "Wirtschaftsuniversitat Wien", "affiliation-city": "Vienna", "affiliation-country": "Austria" }], "prism:aggregationType": "Book Series", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "25674" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84976640067" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84976640067?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84976640067&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84976640067&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84976640067", "dc:identifier": "SCOPUS_ID:84976640067", "eid": "2-s2.0-84976640067", "dc:title": "Narrowing the business-IT gap in process performance measurement", "dc:creator": "Van Der Aa H.", "prism:publicationName": "Lecture Notes in Computer Science (including subseries Lecture Notes in Artificial Intelligence and Lecture Notes in Bioinformatics)", "prism:issn": "03029743", "prism:eIssn": "16113349", "prism:isbn": "9783319396958", "prism:volume": "9694", "prism:pageRange": "543-557", "prism:coverDate": "2016-01-01", "prism:coverDisplayDate": "2016", "prism:doi": "10.1007/978-3-319-39696-533", "citedby-count": "0", "affiliation": [{ "@_fa": "true", "affilname": "Vrije Universiteit Amsterdam", "affiliation-city": "Amsterdam", "affiliation-country": "Netherlands" }], "prism:aggregationType": "Book Series", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "25674" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84958552645" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84958552645?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84958552645&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84958552645&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84958552645", "dc:identifier": "SCOPUS_ID:84958552645", "eid": "2-s2.0-84958552645", "dc:title": "Automated team selection and compliance checking in business processes", "dc:creator": "Cabanillas C.", "prism:publicationName": "ACM International Conference Proceeding Series", "prism:isbn": "9781450333467", "prism:volume": "24-26-August-2015", "prism:pageRange": "42-51", "prism:coverDate": "2015-08-24", "prism:coverDisplayDate": "24 August 2015", "prism:doi": "10.1145/2785592.2785613", "citedby-count": "4", "affiliation": [{ "@_fa": "true", "affilname": "Wirtschaftsuniversitat Wien", "affiliation-city": "Vienna", "affiliation-country": "Austria" }], "prism:aggregationType": "Conference Proceeding", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "11600154611" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84956658737" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84956658737?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84956658737&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84956658737&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84956658737", "dc:identifier": "SCOPUS_ID:84956658737", "eid": "2-s2.0-84956658737", "dc:title": "Linked USDL Agreement: Effectively Sharing Semantic Service Level Agreements on the Web", "dc:creator": "Garcia J.", "prism:publicationName": "Proceedings - 2015 IEEE International Conference on Web Services, ICWS 2015", "prism:isbn": "9781467380904", "prism:pageRange": "137-144", "prism:coverDate": "2015-08-13", "prism:coverDisplayDate": "13 August 2015", "prism:doi": "10.1109/ICWS.2015.28", "citedby-count": "3", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Conference Proceeding", "subtype": "cp", "subtypeDescription": "Conference Paper", "article-number": "7195562", "source-id": "21100442051" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84928709671" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84928709671?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84928709671&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84928709671&origin=inward" }, { "@_fa": "true", "@ref": "full-text", "@href": "https://api.elsevier.com/content/article/eid/1-s2.0-S0306437915000460" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84928709671", "dc:identifier": "SCOPUS_ID:84928709671", "eid": "2-s2.0-84928709671", "dc:title": "Specification and automated design-time analysis of the business process human resource perspective", "dc:creator": "Cabanillas C.", "prism:publicationName": "Information Systems", "prism:issn": "03064379", "prism:volume": "52", "prism:pageRange": "55-82", "prism:coverDate": "2015-08-01", "prism:coverDisplayDate": "1 August 2015", "prism:doi": "10.1016/j.is.2015.03.002", "pii": "S0306437915000460", "citedby-count": "7", "affiliation": [{ "@_fa": "true", "affilname": "Wirtschaftsuniversitat Wien", "affiliation-city": "Vienna", "affiliation-country": "Austria" }], "prism:aggregationType": "Journal", "subtype": "ar", "subtypeDescription": "Article", "source-id": "12305" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84924206022" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84924206022?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84924206022&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84924206022&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84924206022", "dc:identifier": "SCOPUS_ID:84924206022", "eid": "2-s2.0-84924206022", "dc:title": "Towards Compensable SLAs", "dc:creator": "Müller C.", "prism:publicationName": "Communications in Computer and Information Science", "prism:issn": "18650929", "prism:isbn": "9783319148854", "prism:volume": "508", "prism:pageRange": "31-38", "prism:coverDate": "2015-01-01", "prism:coverDisplayDate": "2015", "prism:doi": "10.1007/978-3-319-14886-1 4", "citedby-count": "0", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Book Series", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "17700155007" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84937484907" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84937484907?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84937484907&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84937484907&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84937484907", "dc:identifier": "SCOPUS_ID:84937484907", "eid": "2-s2.0-84937484907", "dc:title": "Modelling service level agreements for business process outsourcing services", "dc:creator": "Del-Río-Ortega A.", "prism:publicationName": "Lecture Notes in Computer Science (including subseries Lecture Notes in Artificial Intelligence and Lecture Notes in Bioinformatics)", "prism:issn": "03029743", "prism:eIssn": "16113349", "prism:isbn": "9783319190686", "prism:volume": "9097", "prism:pageRange": "485-500", "prism:coverDate": "2015-01-01", "prism:coverDisplayDate": "2015", "prism:doi": "10.1007/978-3-319-19069-3_30", "citedby-count": "2", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Book Series", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "25674" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84937439716" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84937439716?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84937439716&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84937439716&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84937439716", "dc:identifier": "SCOPUS_ID:84937439716", "eid": "2-s2.0-84937439716", "dc:title": "RALph: A graphical notation for resource assignments in business processes", "dc:creator": "Cabanillas C.", "prism:publicationName": "Lecture Notes in Computer Science (including subseries Lecture Notes in Artificial Intelligence and Lecture Notes in Bioinformatics)", "prism:issn": "03029743", "prism:eIssn": "16113349", "prism:isbn": "9783319190686", "prism:volume": "9097", "prism:pageRange": "53-68", "prism:coverDate": "2015-01-01", "prism:coverDisplayDate": "2015", "prism:doi": "10.1007/978-3-319-19069-3_4", "citedby-count": "10", "affiliation": [{ "@_fa": "true", "affilname": "Wirtschaftsuniversitat Wien", "affiliation-city": "Vienna", "affiliation-country": "Austria" }], "prism:aggregationType": "Book Series", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "25674" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84919764236" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84919764236?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84919764236&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84919764236&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84919764236", "dc:identifier": "SCOPUS_ID:84919764236", "eid": "2-s2.0-84919764236", "dc:title": "Automated analysis of conflicts in WS-agreement", "dc:creator": "Müller C.", "prism:publicationName": "IEEE Transactions on Services Computing", "prism:issn": "19391374", "prism:volume": "7", "prism:issueIdentifier": "4", "prism:pageRange": "530-544", "prism:coverDate": "2014-01-01", "prism:coverDisplayDate": "OCTOBER/DECEMBER 2014", "prism:doi": "10.1109/TSC.2013.9", "citedby-count": "5", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Journal", "subtype": "ar", "subtypeDescription": "Article", "article-number": "6464252", "source-id": "18300156728" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84904566806" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84904566806?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84904566806&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84904566806&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84904566806", "dc:identifier": "SCOPUS_ID:84904566806", "eid": "2-s2.0-84904566806", "dc:title": "Towards process-aware cross-organizational human resource management", "dc:creator": "Cabanillas C.", "prism:publicationName": "Lecture Notes in Business Information Processing", "prism:issn": "18651348", "prism:isbn": "9783662437445", "prism:volume": "175 LNBIP", "prism:pageRange": "79-93", "prism:coverDate": "2014-01-01", "prism:coverDisplayDate": "2014", "prism:doi": "10.1007/978-3-662-43745-2", "citedby-count": "2", "affiliation": [{ "@_fa": "true", "affilname": "Wirtschaftsuniversitat Wien", "affiliation-city": "Vienna", "affiliation-country": "Austria" }], "prism:aggregationType": "Book Series", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "17500155101" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84910012805" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84910012805?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84910012805&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84910012805&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84910012805", "dc:identifier": "SCOPUS_ID:84910012805", "eid": "2-s2.0-84910012805", "dc:title": "Towards a formal specification of SLAs with compensations*", "dc:creator": "Müller C.", "prism:publicationName": "Lecture Notes in Computer Science (including subseries Lecture Notes in Artificial Intelligence and Lecture Notes in Bioinformatics)", "prism:issn": "03029743", "prism:eIssn": "16113349", "prism:isbn": "9783662455623", "prism:volume": "8841", "prism:pageRange": "295-312", "prism:coverDate": "2014-01-01", "prism:coverDisplayDate": "2014", "citedby-count": "3", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Book Series", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "25674" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84903125151" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84903125151?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84903125151&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84903125151&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84903125151", "dc:identifier": "SCOPUS_ID:84903125151", "eid": "2-s2.0-84903125151", "dc:title": "Comprehensive explanation of SLA violations at runtime", "dc:creator": "Müller C.", "prism:publicationName": "IEEE Transactions on Services Computing", "prism:issn": "19391374", "prism:volume": "7", "prism:issueIdentifier": "2", "prism:pageRange": "168-183", "prism:coverDate": "2014-01-01", "prism:coverDisplayDate": "April/June 2014", "prism:doi": "10.1109/TSC.2013.45", "citedby-count": "24", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Journal", "subtype": "ar", "subtypeDescription": "Article", "article-number": "6606792", "source-id": "18300156728" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84915775932" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84915775932?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84915775932&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84915775932&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84915775932", "dc:identifier": "SCOPUS_ID:84915775932", "eid": "2-s2.0-84915775932", "dc:title": "KPIshare: A collaborative space for BPM practitioners for full definitions and discussions on process KPIs", "dc:creator": "Resinas M.", "prism:publicationName": "CEUR Workshop Proceedings", "prism:issn": "16130073", "prism:volume": "1295", "prism:pageRange": "61-65", "prism:coverDate": "2014-01-01", "prism:coverDisplayDate": "2014", "citedby-count": "0", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Conference Proceeding", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "21100218356" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84892387440" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84892387440?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84892387440&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84892387440&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84892387440", "dc:identifier": "SCOPUS_ID:84892387440", "eid": "2-s2.0-84892387440", "dc:title": "PPINOT tool suite: A performance management solution for process-oriented organisations", "dc:creator": "Del-Río-Ortega A.", "prism:publicationName": "Lecture Notes in Computer Science (including subseries Lecture Notes in Artificial Intelligence and Lecture Notes in Bioinformatics)", "prism:issn": "03029743", "prism:eIssn": "16113349", "prism:isbn": "9783642450044", "prism:volume": "8274 LNCS", "prism:pageRange": "675-678", "prism:coverDate": "2013-12-01", "prism:coverDisplayDate": "2013", "prism:doi": "10.1007/978-3-642-45005-1_58", "citedby-count": "3", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Book Series", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "25674" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84892417783" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84892417783?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84892417783&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84892417783&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84892417783", "dc:identifier": "SCOPUS_ID:84892417783", "eid": "2-s2.0-84892417783", "dc:title": "iAgree studio: A platform to edit and validate WS-agreement documents", "dc:creator": "Müller C.", "prism:publicationName": "Lecture Notes in Computer Science (including subseries Lecture Notes in Artificial Intelligence and Lecture Notes in Bioinformatics)", "prism:issn": "03029743", "prism:eIssn": "16113349", "prism:isbn": "9783642450044", "prism:volume": "8274 LNCS", "prism:pageRange": "696-699", "prism:coverDate": "2013-12-01", "prism:coverDisplayDate": "2013", "prism:doi": "10.1007/978-3-642-45005-1_63", "citedby-count": "0", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Book Series", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "25674" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84892392554" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84892392554?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84892392554&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84892392554&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84892392554", "dc:identifier": "SCOPUS_ID:84892392554", "eid": "2-s2.0-84892392554", "dc:title": "Priority-based human resource allocation in business processes", "dc:creator": "Cabanillas C.", "prism:publicationName": "Lecture Notes in Computer Science (including subseries Lecture Notes in Artificial Intelligence and Lecture Notes in Bioinformatics)", "prism:issn": "03029743", "prism:eIssn": "16113349", "prism:isbn": "9783642450044", "prism:volume": "8274 LNCS", "prism:pageRange": "374-388", "prism:coverDate": "2013-12-01", "prism:coverDisplayDate": "2013", "prism:doi": "10.1007/978-3-642-45005-1_26", "citedby-count": "11", "affiliation": [{ "@_fa": "true", "affilname": "Wirtschaftsuniversitat Wien", "affiliation-city": "Vienna", "affiliation-country": "Austria" }], "prism:aggregationType": "Book Series", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "25674" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84892404731" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84892404731?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84892404731&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84892404731&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84892404731", "dc:identifier": "SCOPUS_ID:84892404731", "eid": "2-s2.0-84892404731", "dc:title": "Extending WS-agreement to support automated conformity check on transport and logistics service agreements", "dc:creator": "Gutiérrez A.", "prism:publicationName": "Lecture Notes in Computer Science (including subseries Lecture Notes in Artificial Intelligence and Lecture Notes in Bioinformatics)", "prism:issn": "03029743", "prism:eIssn": "16113349", "prism:isbn": "9783642450044", "prism:volume": "8274 LNCS", "prism:pageRange": "567-574", "prism:coverDate": "2013-12-01", "prism:coverDisplayDate": "2013", "prism:doi": "10.1007/978-3-642-45005-1_47", "citedby-count": "4", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Book Series", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "25674" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84872148430" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84872148430?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84872148430&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84872148430&origin=inward" }, { "@_fa": "true", "@ref": "full-text", "@href": "https://api.elsevier.com/content/article/eid/1-s2.0-S0306437912001469" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84872148430", "dc:identifier": "SCOPUS_ID:84872148430", "eid": "2-s2.0-84872148430", "dc:title": "On the definition and design-time analysis of process performance indicators", "dc:creator": "Del-Río-Ortega A.", "prism:publicationName": "Information Systems", "prism:issn": "03064379", "prism:volume": "38", "prism:issueIdentifier": "4", "prism:pageRange": "470-490", "prism:coverDate": "2013-01-16", "prism:coverDisplayDate": "2013", "prism:doi": "10.1016/j.is.2012.11.004", "pii": "S0306437912001469", "citedby-count": "24", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Journal", "subtype": "ar", "subtypeDescription": "Article", "source-id": "12305" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84924325072" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84924325072?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84924325072&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84924325072&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84924325072", "dc:identifier": "SCOPUS_ID:84924325072", "eid": "2-s2.0-84924325072", "dc:title": "Defining and analysing resource-aware process performance indicators", "dc:creator": "Del-Río-Ortega A.", "prism:publicationName": "CEUR Workshop Proceedings", "prism:issn": "16130073", "prism:volume": "998", "prism:pageRange": "57-64", "prism:coverDate": "2013-01-01", "prism:coverDisplayDate": "2013", "citedby-count": "0", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Conference Proceeding", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "21100218356" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84873142934" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84873142934?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84873142934&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84873142934&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84873142934", "dc:identifier": "SCOPUS_ID:84873142934", "eid": "2-s2.0-84873142934", "dc:title": "Designing business processes with history-aware resource assignments", "dc:creator": "Cabanillas C.", "prism:publicationName": "Lecture Notes in Business Information Processing", "prism:issn": "18651348", "prism:isbn": "9783642362842", "prism:volume": "132 LNBIP", "prism:pageRange": "101-112", "prism:coverDate": "2013-01-01", "prism:coverDisplayDate": "2013", "prism:doi": "10.1007/978-3-642-36285-9-12", "citedby-count": "3", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Book Series", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "17500155101" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84872783255" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84872783255?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84872783255&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84872783255&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84872783255", "dc:identifier": "SCOPUS_ID:84872783255", "eid": "2-s2.0-84872783255", "dc:title": "Automated resource assignment in BPMN models using RACI matrices", "dc:creator": "Cabanillas C.", "prism:publicationName": "Lecture Notes in Computer Science (including subseries Lecture Notes in Artificial Intelligence and Lecture Notes in Bioinformatics)", "prism:issn": "03029743", "prism:eIssn": "16113349", "prism:isbn": "9783642336058", "prism:volume": "7565 LNCS", "prism:issueIdentifier": "PART 1", "prism:pageRange": "56-73", "prism:coverDate": "2012-12-01", "prism:coverDisplayDate": "2012", "prism:doi": "10.1007/978-3-642-33606-5_5", "citedby-count": "4", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Book Series", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "25674" }, { "@_fa": "true", "link": [{ "@_fa": "true", "@ref": "self", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84866425490" }, { "@_fa": "true", "@ref": "author-affiliation", "@href": "https://api.elsevier.com/content/abstract/scopus_id/84866425490?field=author,affiliation" }, { "@_fa": "true", "@ref": "scopus", "@href": "https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=84866425490&origin=inward" }, { "@_fa": "true", "@ref": "scopus-citedby", "@href": "https://www.scopus.com/inward/citedby.uri?partnerID=HzOxMe3b&scp=84866425490&origin=inward" }], "prism:url": "https://api.elsevier.com/content/abstract/scopus_id/84866425490", "dc:identifier": "SCOPUS_ID:84866425490", "eid": "2-s2.0-84866425490", "dc:title": "Defining process performance indicators by using templates and patterns", "dc:creator": "Del-Río-Ortega A.", "prism:publicationName": "Lecture Notes in Computer Science (including subseries Lecture Notes in Artificial Intelligence and Lecture Notes in Bioinformatics)", "prism:issn": "03029743", "prism:eIssn": "16113349", "prism:isbn": "9783642328848", "prism:volume": "7481 LNCS", "prism:pageRange": "223-228", "prism:coverDate": "2012-09-24", "prism:coverDisplayDate": "2012", "prism:doi": "10.1007/978-3-642-32885-5_18", "citedby-count": "10", "affiliation": [{ "@_fa": "true", "affilname": "Universidad de Sevilla", "affiliation-city": "Sevilla", "affiliation-country": "Spain" }], "prism:aggregationType": "Book Series", "subtype": "cp", "subtypeDescription": "Conference Paper", "source-id": "25674" }] } }');
                var papers = "<ul>";
                for (var i = 0; i < data["search-results"].entry.length; i++) {
                    var entry = data["search-results"].entry[i];
                    papers += "<li><b><a href=https://www.scopus.com/inward/record.uri?partnerID=HzOxMe3b&scp=\"" + entry["eid"].substring(7, entry["eid"].length) + "\">" + entry["dc:title"] + "</a></b><ul><li>" + entry["prism:publicationName"] + "</li><li>Cited by " + entry["citedby-count"] + "</li></ul></li>";
                    if (i == 5)
                        break;
                }
                $("#modal-papers").html(papers + "</ul>");
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

    console.log("Invoking https://aws1617-dcp-sandbox-aws1617dcp.c9users.io/api/v1/universities/1");
    var request = $.get(
        "https://aws1617-dcp-sandbox-aws1617dcp.c9users.io/api/v1/universities/", {},
        function(data) {
            responses.universities = data;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var university = data[key];
                    var abb = getCapitals(university.name);
                    dataset.nodes.push({
                        id: university.id,
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
    request = $.get(
        "https://aws1617-02.herokuapp.com/api/v1/researchers/", {},
        function(data) {
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
    );

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
            var id_university = responses.groups[key].id_university;
            dataset.nodes.find(function(item, j) {
                if (item.id === id_university && item.type === 1) {
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
                //text += "<blockquote class=\"twitter-tweet tw-align-center\"><p>" + tweets[i].text + "</p>&mdash; " + tweets[i].user.name + " (@" + tweets[i].user.screen_name + ") <a href=\"https://twitter.com/HubSpot/status/312028320004980736\">March 14, 2013</a></blockquote>";
                twttr.widgets.createTweet(
                        tweets[i].id_str,
                        document.getElementById('tweets'), {
                            align: 'left'
                        })
                    .then(function(el) {
                        console.log("Tweet displayed." + el);
                    });
                if (i == 5)
                    break;
            }

            $("#tweets").html(text);
        }
    );
}
