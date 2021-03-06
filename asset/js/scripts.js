// Prepare the component list dropdown for display
$(function () {
    var components = $(".zf-components"),
        componentList = components.find(".component-list"),
        sidebar = $(".bs-sidebar.affix"),
        sidebarInitialPos = sidebar.css("position"),
        sidebarInitialTop = sidebar.length ? sidebar.position().top : 0,
        hidden,
        componentToggle = $(".component-toggle"),
        navbar = $(".navbar-fixed-top"),
        rollUpLink = $(".zf-components-rollup a");

    // Initial setup on document load
    components.insertBefore(navbar);
    $(".zf-logo a").tooltip();
    $(".logo-link").tooltip();
    componentToggle.tooltip();
    rollUpLink.attr({href: "#", alt: "Hide component list"});

    // Cast initial sidebar position value
    if (typeof sidebarInitialPos === 'undefined') {
        sidebarInitialPos = "fixed";
    }

    // Setup onclick events to toggle list
    componentToggle.click(toggleComponentList);
    rollUpLink.click(toggleComponentList);

    // Toggle the component list display
    function toggleComponentList(event) {
        event.preventDefault();

        if (typeof hidden === 'undefined') {
            // Not loaded yet; load and display.
            loadComponentList();
            return;
        }

        if (hidden) {
            // Hidden; display.
            showComponentList();
            return;
        }

        // Currently visible; hide
        hideComponentList();
    }

    // Show the component list
    function showComponentList() {
        navbar.css({position: "relative"});
        sidebar.css({position: "relative"});
        components
            .css({"margin-top": "-" + components.outerHeight() + "px"})
            .show()
            .animate({"margin-top": 0}, {
                complete: function () {
                    componentToggle
                        .data("placement", "top")
                        .attr("data-original-title", "Hide component list");
                    hidden = false;
                },
                queue: false
            });
    }

    // Hide the component list
    function hideComponentList() {
        components.animate({"margin-top": "-" + components.outerHeight() + "px"}, {
            complete: function () {
                navbar.css({position: "fixed"});
                sidebar.css({position: sidebarInitialPos});
                componentToggle
                    .data("placement", "bottom")
                    .attr("data-original-title", "Show component list");
                components.hide();
                hidden = true;
            },
            queue: false
        });
        sidebar.animate({top: sidebarInitialTop + "px"}, {queue: false});
    }

    // Inject a component into the componet list DOM.
    function injectComponent(index, component) {
        componentList.append('<div class="component"><h4><a href="' + component.url + '">' + component.name + '</a></h4><p>' + component.description + '</p></div>');
    }

    // Parse the component list, build the DOM, and display it.
    function parseComponentList(components) {
        $.each(components, injectComponent);
        showComponentList();
    }

    // Fetch the component list and display it.
    function loadComponentList() {
        $.ajax({
            url: "//docs.zendframework.com/zf-mkdoc-theme/scripts/zf-component-list.json",
            dataType: "text json",
            success: parseComponentList,
            error: function (e) {
                console.log("Error occurred with XHR call", e);
            }
        });
    }
});
