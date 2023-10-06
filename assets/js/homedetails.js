var homeDetails = function () {
    var map, favHomes = [], taxesMonth = 0,
        init = function () {
            bindFn();
        },
        bindFn = function () {


            bindJs();
            if (parseFloat($("#lat").val()) > 0) {
                bindMap();
                bindSchool();
                bindCommunityPeople();
                bindAminities();
                bindCommute();
                bindPriceTrend();
                similarHomes();
                bindCalculator();
                bindEstimateHomes();
            }

            listingHistory();
            getFav();
        },
        bindJs = function () {

            var carousel = $('.carousel').carousel({
                interval: 500000
            });

            var owl = $('.owl-carousel').owlCarousel({
                loop: false,
                margin: 10,
                nav: true,
                responsive: {
                    0: {
                        items: 2
                    },
                    600: {
                        items: 5
                    },
                    1000: {
                        items: 11
                    }
                },
                onChanged: function (event) {
                    carousel.carousel(event.item.index);
                    $(".owl-item .item").removeClass("active");
                    $(".owl-item .item.item-number-" + event.item.index).addClass("active");
                }
            });

            $('.owl-item').on('click', function (event) {
                var $this = $(this);
                if (!$this.find(".item").hasClass('active')) {
                    var index = $this.index();
                    carousel.carousel(index);
                    $(".owl-item .item").removeClass("active");
                    $(".owl-item .item.item-number-" + index).addClass("active");
                    owl.trigger('to.owl.carousel', [index, 300, true]);
                }
            });

            // carousel.on('slide.bs.carousel', function () {
            //     setTimeout(function(){ 
            //         var index = $(".carousel-inner .carousel-item.active").index();                    
            //         owl.trigger('to.owl.carousel',  [index,300,true]);
            //     }, 1000);
            // });

            $("#realtor-request").click(function () {
                realtorRequest();
            });

            $(function () {
                if ($(window).width() > 991) {
                    const totalHeight = $(".container").height();
                    var offset = $("#sidebar").offset();
                    var footer = $("footer").offset();
                    var topPadding = 100;
                    $(window).scroll(function () {
                        if ($(window).scrollTop() > offset.top && $(window).scrollTop() < (footer.top - topPadding - $("#sidebar").height())) {
                            $("#sidebar").stop().animate({
                                marginTop: $(window).scrollTop() - offset.top + topPadding
                            });
                        } else if ($(window).scrollTop() > (footer.top - $("#sidebar").height() - 100)) {
                            $("#sidebar").stop().animate({
                                marginTop: totalHeight - $("footer").height()
                            });
                        } else if ($(window).scrollTop() < offset.top) {
                            $("#sidebar").stop().animate({
                                marginTop: 0
                            });
                        };
                    });

                }
            });

            $(".plus-email").click(function () {
                plusclick();
            });

            $("#send-share").click(function () {
                shareListing();
            });

            $("#share-model-open").click(function(){
                if($("#UserId").val() != ""){
                    $("#shareModal").modal();
                }
            });
        },
        bindMap = function () {
            var mapOptions = {
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
            };
            map = new google.maps.Map(document.getElementById("map"), mapOptions);
            map.setCenter(new google.maps.LatLng($("#lat").val(), $("#lng").val()));

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng($("#lat").val(), $("#lng").val()),
                map: map,
                icon: "/content/img/map-icon-current.png",
                title: $("#Address").val()
            });
        },
        bindSchool = function () {
            var data = {
                'Latitude': $("#lat").val(),
                'Longitude': $("#lng").val(),
                'UserId': ($("#UserId").val() == "" ? $("#TempUserId").val() : $("#UserId").val())
            };

            general.doAjaxPost(apiUrl + 'Neighbourhood/schools_list', data, function (d) {
                $(".schools-data").html("");
                $(".schools-data").removeClass("text-center");
                $.each(d.data.Result, function (innnn, val) {
                    
                    if($(".school-validate-1").length == 0 && val.Grade == "Elementary" && val.SchoolType == "Public" && val.BoardUrl!=""){
                        var h = "<a class='school-validate-1' target='_blank' href='"+val.BoardUrl+"'>Validate Public School District</a>";
                        $(".validate-links").prepend(h);                        
                    }
                    else if($(".school-validate-2").length == 0 && val.Grade == "Elementary" && val.SchoolType == "Catholic" && val.BoardUrl!=""){
                        var h = "<a class='school-validate-2' target='_blank' href='"+val.BoardUrl+"'>Validate Catholic Board School District</a>";
                        $(".validate-links").append(h);
                    }

                    var html = '<div class="inner-block">';
                    html += '<div class="left">';
                    html += '<div class="img-box">';
                    html += '<span>SCORE</span>';
                    html += '<h2>' + val.Total + '</h2>';
                    html += '</div>';
                    html += '<div class="c-box">';
                    html += '<h6><a href="'+val.Url+'">' + val.School + ' School</a></h6>';
                    html += '<p>' + val.Address + '</p>';
                    html += '</div>';
                    html += '</div>';
                    html += '<div class="right">';
                    html += '<div class="r-box">';
                    html += '<h6>Grades</h6>';
                    html += '<p>' + val.Grade + '</p>';
                    html += '</div>';
                    html += '<div class="r-box">';
                    html += '<h6>Type</h6>';
                    html += '<p>' + val.SchoolType + '</p>';
                    html += '</div>';
                    html += '<div class="r-box">';
                    html += '<h6>Distance</h6>';
                    html += '<p>' + val.Distance + '</p>';
                    html += ' </div>';
                    // html+= '<a href="javascript:void(0);" class="right-arrow">';
                    // html+= '<img src="assets/img/icon-chevron-right-black@2x.png" alt="" />';
                    // html+= '</a>';
                    html += '</div>';
                    html += '</div>';
                    $(".schools-data").append(html);
                });
            });


        },
        bindCommunityPeople = function () {

            var data = {
                'Latitude': $("#lat").val(),
                'Longitude': $("#lng").val(),
                'UserId': ($("#UserId").val() == "" ? $("#TempUserId").val() : $("#UserId").val())
            };

            general.doAjaxPost('/home/CommunityPeopleData', data, function (d) {
                $(".age-wise-data").html("");
                $(".age-wise-data").removeClass("text-center");
                $(".country-wise-data").html("");
                $(".country-wise-data").removeClass("text-center");

                if (d.data.length > 0) {
                    var data = d.data[0].Regions;
                    var html = '<div class="people-block">';
                    html += '<p>' + d.data[0].TopHeader + '</p>';
                    html += '</div>';

                    $(".age-wise-data").html(html);

                    $.each(data, function (innnn, val) {
                        var h = '<div class="inner-block">';
                        h += '<div class="left">';
                        h += '<img src="/content/img/' + val.Image + '@1x.png" alt=""/>';
                        h += '<div class="detail">';
                        h += '<p>' + val.CategoryLabel + '</p>';
                        h += '<div class="progress-block">';
                        h += '<div class="bar" style="width: ' + val.Value + '%;"></div>';
                        h += '<div class="bar" style="width: ' + val.GTAAvg + '%;"></div>';
                        h += '</div>';
                        h += '</div>';
                        h += '</div>';
                        h += '<div class="right">';
                        h += '<span>' + val.Value + '%</span>';
                        h += '<span>GTA: ' + val.GTAAvg + '%</span>';
                        h += '</div>';
                        h += '</div>';
                        $(".age-wise-data .people-block").append(h);
                    });
                }

                if (d.data.length > 1) {
                    var data = d.data[1].Regions;
                    var html = '<div class="people-block">';
                    html += '<p>' + d.data[1].TopHeader + '</p>';
                    html += '</div>';

                    $(".country-wise-data").html(html);

                    $.each(data, function (innnn, val) {
                        var h = '<div class="inner-block">';
                        h += '<div class="left">';
                        if(val.Image == ""){
                            h += '<img src="/content/img/people_east@1x.png" alt=""/>';
                        }else{
                            h += '<img src="/content/img/' + val.Image + '@1x.png" alt=""/>';
                        }
                        
                        h += '<div class="detail">';
                        h += '<p>' + val.CategoryLabel + '</p>';
                        h += '<div class="progress-block">';
                        h += '<div class="bar" style="width: ' + val.Value + '%;"></div>';
                        h += '<div class="bar" style="width: ' + val.GTAAvg + '%;"></div>';
                        h += '</div>';
                        h += '</div>';
                        h += '</div>';
                        h += '<div class="right">';
                        h += '<span>' + val.Value + '%</span>';
                        h += '<span>GTA: ' + val.GTAAvg + '%</span>';
                        h += '</div>';
                        h += '</div>';
                        $(".country-wise-data .people-block").append(h);
                    });
                }
            });
        },
        bindAminities = function () {

            var data = {
                'Latitude': $("#lat").val(),
                'Logitude': $("#lng").val(),
                'UserId': ($("#UserId").val() == "" ? $("#TempUserId").val() : $("#UserId").val())
            };

            general.doAjaxPost('/home/AminitiesData', data, function (d) {
                $(".location-data").html("");
                $(".location-data").removeClass("text-center");
                $.each(d.data.GroupRatings, function (innnn, value) {
                    if (value.Group != "Schools and Day Care" && value.Group != "Transportation") {
                        $.each(value.Items, function (innnn, val) {

                            var image = '/content/img/' + val.SummaryIcon;

                            var html = '<div class="inner-block">';
                            html += '<div class="left">';
                            html += '<div class="c-box icon-text">';
                            html += '<img src="' + image + '">';
                            html += '<h6>' + val.Name + '</h6>';
                            html += '</div>';
                            html += '</div>';

                            html+='<div class="middle"><h6>'+val.Type+'</h6></div>';

                            html += '<div class="right">';
                            html += '<div class="r-box text-right">';
                            html += '<h6>' + val.DistanceInWords + '</h6>';
                            html += '</div>';
                            html += '</div>';
                            html += '</div>';
                            $(".location-data").append(html);
                        });
                    }
                });
            });
        },
        bindCommute = function () {

            var data = {
                'Latitude': $("#lat").val(),
                'Logitude': $("#lng").val(),
                'UserId': ($("#UserId").val() == "" ? $("#TempUserId").val() : $("#UserId").val())
            };

            general.doAjaxPost('/home/CommuteData', data, function (d) {
                $(".commute-data").html("");
                $(".commute-data").removeClass("text-center");
                $.each(d.data, function (innnn, val) {

                    var image = '/content/img/' + val.SummaryIcon;

                    var html = '<div class="inner-block">';
                    html += '<div class="left">';
                    html += '<div class="c-box icon-text">';
                    html += '<img src="' + image + '">';
                    html += '<h6>' + val.Name + '</h6>';
                    html += '</div>';
                    html += '</div>';
                    html += '<div class="right">';
                    html += '<div class="r-box text-right">';
                    html += '<h6>' + val.DistanceInWords + '</h6>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    $(".commute-data").append(html);
                });
            });
        },
        bindPriceTrend = function () {
            var data = {
                'SoldDate': "",
                'Community': $(".community-data").html(),
                'HomeType': $(".home-type-data").html(),
                'MunicipalityDistrict': $("#MunicipalityDistrict").val()
            };

            general.doAjax('/home/getNhdInfo', data, function (d) {
                $("#avg-price").html(d.AvgPrice);
                $("#avg-days").html(d.AvgDaysOnMarket);
                $("#avg-sold-price").html(d.AvgSoldPrice);
            });
            bindChart();
        },
        bindChart = function () {
            var data = {
                'SoldDate': "",
                'Community': $(".community-data").html(),
                'HomeType': $(".home-type-data").html(),
                'MunicipalityDistrict': $("#MunicipalityDistrict").val()
            };

            general.doAjax('/home/getGraphData', data, function (d) {
                if ($("#chartContainer").length > 0 && $("#chartContainer").html() == "") {
                    homeEstimate.bindChart(d);
                }
            });
        },
        listingHistory = function () {

            var data = {
                'MLS': $("#mls-id").val(),
                'Id': 0
            };


            general.doAjax('/home/getListingHistory', data, function (d) {
                $(".listing-history-data").html("");
                $(".listing-history-data").removeClass("text-center");

                var html = "<ul>";

                $.each(d, function (index, value) {

                    var link = "/homelistings/" + $("#Address").val().replace(",", "").replace(/\ /g, '-').toLowerCase() + "-D" + value.MLSID + "?history=" + $("#ID").val();
                    html += '<li>';
                    html += '<div class="block">';
                    html += '<div class="date">';
                    html += '<span>' + value.LastSoldDate + '</span>';
                    html += '<b>' + value.DaysOnMarket + ' Days</b>';
                    html += '</div>';
                    html += '<a href="' + link + '">' + value.MLSID + '</a>';
                    html += '<div class="price">';
                    if (value.LastSoldPrice != "") {
                        html += '<span><b>' + value.LastSoldPrice + '</b></span>';
                        html += '<span><b>' + value.LastStatus + '</b></span>';
                    } else {
                        html += '<span><b>' + value.ListPriceStr + '</b></span>';
                        html += '<span><b>' + value.LastStatus + '</b></span>';
                    }

                    html += '</div>';
                    html += '</div>';
                    html += '</li>';
                });

                html += '</ul>';

                if(d.length == 0){
                    html = "<p>We did not find any recent listing history for this Property.</p>";
                }


                $(".listing-history-data").html(html);
            });

        },
        similarHomes = function () {

            var data = {
                'MLS': $("#mls-id").val(),
                'Latitude': $("#lat").val(),
                'Longitude': $("#lng").val(),
                'UserId': ($("#UserId").val() == "" ? $("#TempUserId").val() : $("#UserId").val()),
                'HomeType': $(".home-type-data").html(),
                'Style': $(".style-data").html(),
            };


            general.doAjax('/home/SimilarHomes', data, function (d) {
                console.log(d);
                $(".similar-history-data").html("");
                $(".similar-history-data").removeClass("text-center");

                if(d.data.TotalCount == 0){
                    $(".similar-history-data").html("<p>We did not find any similar homes for this Property</p>");
                }else{
                    $(".similar-history-data").addClass("row");
                }

                $.each(d.data.Result, function (index, value) {
                    var link = "/homelistings/" + value.Address.replace(",", "").replace(/\ /g, '-').toLowerCase() + "-" + value.MunicipalityDistrict.replace(",", "").replace(/\ /g, '-').toLowerCase() + "-D" + value.MLS;

                    var html = '<div class="col-md-4">';
                    html += '<div class="block">';
                    html += '<a href="' + link + '">';
                    html += '<div class="img-block">';
                    html += '<img src="' + value.Image + '" alt="">';
                    html += '</div>';
                    html += '<div class="detail">';
                    html += '<div class="left">';
                    html += '<h4>' + value.ListPrice + '</h4>';
                    html += ' <div>';
                    html += '<div class="stats">' + value.Bedrooms + ' Beds</div>';
                    html += '<div class="stats">' + value.Washrooms + ' Baths</div>';
                    html += '</div>';
                    html += '<p style="padding-bottom: 5px;">' + value.Type + '</p>';
                    html += '<p>' + value.Address + ', ' + value.MunicipalityDistrict + '</p>';
                    // html += '<div class="bages-sec">';
                    // html += '<span>Hardwood Floor</span>';
                    // html += '<span>Brick Exterior</span>';
                    // html += '<span>Deck</span>';
                    // html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</a>';
                    html += '</div>';
                    html += '</div>';

                    $(".similar-history-data").append(html);
                });
            });

        },
        bindEstimateHomes = function () {
            if ($(".estimate-homes-mls").length > 0) {
                var index = 1;
                $(".estimate-homes-mls").each(function () {
                    var mls = $(this).val();
                    if (mls != $("#mls-id").val()) {
                        bindEstimateMLS(mls, index);
                        index = index + 1;
                    }
                });
            } else {
                if ($("#SavedId").val() != "") {
                    // var data = {
                    //     'MLS': $("#mls-id").val(),
                    //     'Id': $("#SavedId").val(),
                    //     'addB4Logic': false,
                    //     'ChangeHomefn': false,
                    //     'MunicipalityDistrict': $("#MunicipalityDistrict").val()
                    // };

                    // var url = '/home/getAddressMapData';
                    // general.doAjax(url, data, function (d) {
                    //     console.log(d);
                    //     var index =1;
                    //     $.each(d, function (innnn, val) {
                    //         console.log(val.MLSID);
                    //         bindEstimateMLS(val.MLSID, index);
                    //         index = index+1;
                    //     });
                    // });
                }
            }

            var data = {
                'Type': $(".home-type-data").html(),
                'Community': $(".community-data").html(),
                'MunicipalityDistrict': $("#MunicipalityDistrict").val()
            };

            general.doAjax('/home/GetMovingAvgNew', data, function (d) {
                $("#moving-avg-price").html(d.Appreciation);
            });

        },
        bindEstimateMLS = function (mls, index) {
            var data = {
                'MLS': mls
            };

            general.doAjax('/home/getMLSdetails', data, function (d) {
                var image = "";
                if (index == 1) {
                    image = "/content/img/icon-a.png";
                }
                else if (index == 2) {
                    image = "/content/img/icon-b.png";
                }
                else if (index == 3) {
                    image = "/content/img/icon-c.png";
                }


                var html = '<div class="col-md-6">';
                html += '<div class="rd-block">';
                html += '<img src="' + d.Image + '" alt=""/>';
                html += '<div class="detail">';
                html += '<div class="top">';
                html += '<span>Sold ' + d.SoldPrice + '</span>';
                html += '<img src="' + image + '" alt=""/>';
                html += '</div>';
                html += '<div class="bottom">';
                html += '<div class="left">';
                html += ' <h4><i class="fa fa-home"></i> ' + d.ListPriceStr + '</h4>';
                html += ' <h6>' + d.Address + ', ' + d.MunicipalityDistrict + '</h6>';
                html += '</div>';
                html += '<div class="right">';
                html += '<div>';
                html += d.Bedrooms;
                html += '<span>Beds</span>';
                html += '</div>';
                html += '<div>';
                html += d.Washrooms;
                html += ' <span>Baths</span>';
                html += ' </div>';
                // html += '<div>';
                // html += ' -';
                // html += '<span>Sq. Ft.</span>';
                // html += ' </div>';
                html += ' </div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';

                $("#estimate-homes").append(html);
            });
        },
        bindCalculator = function () {
            var taxes = $("#taxes").val() != "" ? parseFloat($("#taxes").val().replace("$", "").replace(/,/g, "")) : 0;
            console.log(taxes);
            if (taxes > 0) {
                var month = taxes / 12;
                taxesMonth = month;
                console.log(month);
                general.doAjax('/home/DoFormat?number=' + month, null, function (dd1) {
                    $("#taxesMonth").html(dd1);
                });
            }

            CalucalteDownPayment();

            $("#Percentage").change(function () {
                CalucalteDownPayment();
            });
        },
        CalucalteDownPayment = function () {
            $("#principal").html("<div class='spinner-border text-info details-btn-loading'></div>");
            $("#total-payment").html("<div class='spinner-border text-info details-btn-loading'></div>");
            var listPirce = parseFloat($("#homePrice").val().replace("$", "").replace(/,/g, ""));
            var per = parseFloat($("#Percentage").val().replace("$", "").replace(/,/g, ""));

            var downpayment = (listPirce * per) / 100;
            general.doAjax('/home/DoFormat?number=' + downpayment, null, function (dd1) {
                $("#DownPayment").val(dd1);
            });

            var payment = listPirce - downpayment;

            var PmtPayment = PMT(payment, 2, 25);

            general.doAjax('/home/DoFormat?number=' + parseInt(PmtPayment), null, function (dd1) {
                $("#principal").html(dd1);
            });

            var condoFee = $("#CondoFee").length > 0 ? parseInt($("#CondoFee").html().replace("$", "").replace(/,/g, "")) : 0;

            var totalPayment = parseInt(PmtPayment) + taxesMonth + condoFee;

            general.doAjax('/home/DoFormat?number=' + totalPayment, null, function (dd1) {
                $("#total-payment").html(dd1 + " per month");
            });


        },
        PMT = function (amount, interest, numberofyears) {
            var principle = amount;
            var years = numberofyears;

            var loanM = (interest / 1200.0);
            var numberMonths = years * 12;
            var negNumberMonths = 0 - numberMonths;
            var monthlyPayment = principle * loanM / (1 - Math.pow((1 + loanM), negNumberMonths));

            return monthlyPayment;
        },
        getFav = function () {
            var data = {
                'UserId': $("#UserId").val(),
            };

            general.doAjaxPost('/home/SearchManager', data, function (d) {
                $.each(d.data.Results, function (innnn, val) {
                    if (val.HomeID == $("#mls-id").val() || val.SoldHomeId == $("#mls-id").val()) {
                        $(".fav-data").addClass("active");
                    }
                });
            });

            $(".fav-data").click(function () {
                var id = this;
                general.showLoader();
                if (!$(this).hasClass("active")) {

                    var data = {
                        'UserId': $("#UserId").val(),
                        'ID': $("#mls-id").val()
                    };

                    general.doAjaxPost('/home/SaveAddress', data, function (d) {
                        $(id).addClass("active");
                        general.hideLoader();
                    });
                } else {
                    var data = {
                        'UserId': $("#UserId").val(),
                        'MLS': $("#mls-id").val()
                    };
                    general.doAjax('/home/deleteMLSFromFav', data, function (d) {
                        $(id).removeClass("active");
                        general.hideLoader();
                    });
                }
            });
        },
        realtorRequest = function () {
            if ($("#PhoneNumber").val() == "") {
                alert("Please enter your phone number");
            } else {
                general.showLoader();
                var data = {
                    'UserID': $("#UserId").val(),
                    'MLS': $("#mls-id").val(),
                    'Phone': $("#PhoneNumber").val()
                };

                general.doAjaxPost('/home/RealtorRequest', data, function (d) {
                    general.hideLoader();
                    alert(d.Message);
                });
            }
        },
        shareListing = function () {
            var email = "";
            $.each($(".Email-Share"), function (i, val) {
                console.log(i);
                console.log(val);
                if($(val).val() != ""){
                    if (email == "") {
                        email = $(val).val();
                    } else {
                        email = email + ";" + $(val).val();
                    }
                }                
            });
            if (email == "") {
                alert("Please enter email");
            } 
            else if ($("#share-notes").val() == "") {
                alert("Please enter your notes");
            } 
            else {
                general.showLoader();
                var data = {
                    'UserID': $("#UserId").val(),
                    'MLS': $("#mls-id").val(),
                    'Email': email,
                    'Message' : $("#share-notes").val()
                };

                general.doAjaxPost('/home/shareListing', data, function (d) {
                    general.hideLoader();
                    alert(d.Message);
                    $("#shareModal").modal('hide');
                });
            }
        },
        plusclick = function () {
            var number = parseInt($(".email-numbers").val());
            $('<div class="add-email"><div class="form-group"><input type="email" class="form-control Email-Share" id="" placeholder="Email Address" /></div></div>').insertAfter("#shareModal .add-email");
            $(".email-numbers").val(number + 1);
        }
    return {
        init: init
    };
}();        