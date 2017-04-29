// infinite scroll
(function($) {

    var counter = 1,
        $window = $(window),
        page = 10,
        previousUrl,
        previousVal;

    function detectPage() {
        var currentUrl = window.location.href,
            currentVal = $("#lst-ib").val();

        if (!previousUrl || currentUrl != previousUrl || currentVal != previousVal) {

            var pos = currentUrl.lastIndexOf('&start=');
            if (pos > currentUrl.lastIndexOf('#q=')) {
                var curPage = currentUrl.substring(pos + 7);
                pos = curPage.indexOf('&');
                if (pos > 0) {
                    curPage = curPage.substr(0, pos);
                }
                curPage = parseInt(curPage);
                if (curPage > 0) {
                    page = curPage + 10
                } else {
                    page = 10;
                }
            } else {
                page = 10;
            }

            previousUrl = currentUrl;
            previousVal = currentVal;

            // setTimeout(function () {
            //     $("#rso").find("._NId h3:not(.infinite-scroll-page)").each(function() {
            //         var $el = $(this),
            //             parent = $el.closest(".kp-blk");
            //         if (!(parent && parent[0])) {
            //             $el.prev(".infinite-scroll-page").remove();
            //             $el.before('<h3 class="infinite-scroll-page r">' + Math.ceil(page / 10) + '</h3>');
            //             previousUrl = currentUrl;
            //             previousVal = currentVal;
            //             return false;
            //         }
            //     });
            // }, 500);
        }
    }

    function execute() {
        var loading = false;

        var scroll = function () {
            detectPage();

            if (!loading) {
                var anchor = $("#pnnext"),
                    rso = $("#rso"),
                    bodyHeight = $("body").height(),
                    scrollTop = $window.scrollTop(),
                    winHeight = $window.height()

                if (anchor && anchor[0] && rso && rso[0] && bodyHeight - scrollTop - winHeight < winHeight) {

                    loading = true;
                    var href = anchor.attr("href");

                    var parts = window.location.href.split("/");
                    if (parts.length < 3) {
                        return void(loading = false);
                    }

                    if (href) {
                        if (page) {
                            href += "&start=" + page;

                            $.get(href, function (data) {

                                var jData = $(data),
                                    rsoAppend = jData.find("#rso"),
                                    toAppend,
                                    nextAnchor = jData.find("#pnnext");

                                if (rsoAppend && rsoAppend[0] && rsoAppend[0].childElementCount) {

                                    rsoAppend.find("._NId h3").each(function() {
                                        var $el = $(this),
                                            parent = $el.closest(".kp-blk");
                                        if (!(parent && parent[0])) {
                                            $el.before('<h3 class="infinite-scroll-page r">' + Math.ceil(page / 10) + '</h3>');
                                            return false;
                                        }
                                    });

                                    toAppend = '<div class="infinite-scroll-animate infinite-scroll-hidden">' +
                                        // '<h3 class="infinite-scroll-page r">' + (page - 9) + '.</h3>' +
                                        rsoAppend.html() +
                                        "</div>";

                                } else {
                                    var form = jData.find("form[action=index]");
                                    if (form && form[0]) {
                                        rso.append(form.html());
                                    }
                                }

                                if (nextAnchor) {
                                    rso.append(toAppend);

                                    jData.find("style").each(function() {
                                        rso.append($(this));
                                    });

                                    $("#foot").replaceWith(jData.find("#foot"));
                                } else {
                                    page = null;
                                }

                                loading = false;
                            });
                        }

                    } else {
                        loading = false;

                        $(".srg").next(".rgsep").remove();
                        counter += 1;

                        $("img[imgsrc]").each(function () {
                            var e = $(this);
                            e.attr({
                                src: e.attr("imgsrc")
                            }).removeAttr("imgsrc")
                        })
                    }

                    if (page) {
                        page += 10;
                    }
                }
            }
        };

        detectPage();
        setInterval(detectPage, 100);

        $window.on("scroll", scroll);
    }

    $window.ready(execute);

}) (jQuery);