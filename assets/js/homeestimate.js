var homeEstimate = function () {
    var map, qpWindows = [], indexMapHome = 0, currentData = [], markers = [],
        init = function () {
            general.loadHeaderSelect("Home");
            bindFn();
        },
        isEmail = function (email) {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(email);
        },
        initNew = function () {

            general.hideLoader();
            $("#nextButton").click(function () {

                var homes = [];
                $.each($(".custom-control-input-1:checked"), function () {
                    homes.push($(this).val());
                });

                if (homes.length == 0) {
                    alert("please select home type");
                } else if ($("#bedrooms").val() == "") {
                    alert("please enter bedrooms");
                } else if ($("#Washrooms").val() == "") {
                    alert("please enter Washrooms");
                }
                else {
                    general.showLoader();
                    var data = {
                        'Type': homes.join(","),
                        'Id': $("#id").val(),
                        'bedrooms': $("#bedrooms").val(),
                        'Washrooms': $("#Washrooms").val(),
                    };

                    general.doAjax('/home/SaveAddressNewApiFirst', data, function (d) {
                        //general.hideLoader();
                        window.location.href = "/estimateuserinfo?id=" + $("#id").val();
                    });
                }

            });

            $("#nextButtonNew").click(function () {

                var homes = [];
                $.each($(".custom-control-input-1:checked"), function () {
                    homes.push($(this).val());
                });

                if (homes.length == 0) {
                    alert("please select home type");
                }
                else if (homes.length > 1) {
                    alert("please select only 1 home type");
                }
                else if ($("#bedrooms").val() == "") {
                    alert("please enter bedrooms");
                } else if ($("#Washrooms").val() == "") {
                    alert("please enter Washrooms");
                }
                else {
                    general.showLoader();
                    var data = {
                        'Type': homes.join(","),
                        'Id': $("#id").val(),
                        'bedrooms': $("#bedrooms").val(),
                        'Washrooms': $("#Washrooms").val(),
                    };

                    general.doAjax('/home/SaveAddressNewApiFirst', data, function (d) {
                        //general.hideLoader();
                        window.location.href = "/homeownerestimateotherinfo?id=" + $("#id").val();
                    });
                }

            });


            $("#nextButtonOther").click(function () {

                var result = false;

                if ($("#userTypehidden").val() == "Detached") {
                    if ($("#taxes").val() == "") {
                        alert("please enter Property Tax");
                    }
                    else if ($("#garage").val() == "") {
                        alert("please enter garage spaces");
                    }
                    else {
                        result = true;
                    }
                } else if ($("#userTypehidden").val() == "Condo Townhouse") {
                    if ($("#taxes").val() == "") {
                        alert("please enter Property Tax");
                    }
                    else if ($("#parkingSpace").val() == "") {
                        alert("please enter Garage/Parking Spaces");
                    }
                    else {
                        result = true;
                    }
                }
                else if ($("#userTypehidden").val() == "Condo Apartment") {
                    if ($("#taxes").val() == "") {
                        alert("please enter Property Tax");
                    }
                    else if ($("#bedroomsPluse").val() == "") {
                        alert("please enter Bedroom Plus");
                    }
                    else if ($("#parkingSpace").val() == "") {
                        alert("please enter Garage/Parking Spaces");
                    }
                    else {
                        result = true;
                    }
                }

                if (result == true) {
                    general.showLoader();
                    var data = {
                        'Id': $("#id").val(),
                        'GarageSpace': $("#garage").val(),
                        'Tax': $("#taxes").val(),
                        'BedroomPlus': $("#bedroomsPluse").val(),
                        'SquareFootage': $("#squareFootage").val(),
                        'ParkingSpace': $("#parkingSpace").val()
                    };

                    general.doAjax('/home/SaveAddressNewApiThird', data, function (d) {
                        //general.hideLoader();
                        window.location.href = "/homeownerestimate?id=" + $("#id").val();
                    });
                }
            });

            $(".next-second").click(function () {
                if ($("#name").val() == "") {
                    alert("please enter name");
                } else if ($("#email").val() == "") {
                    alert("please enter email");
                }
                else if (!isEmail($("#email").val())) {
                    alert("please enter correct email");
                }
                else {
                    general.showLoader();

                    var data = {
                        'Address': $("#FullAddress").val(),
                        'Email': $("#email").val(),
                        'Name': $("#name").val(),
                        'Id': $("#id").val(),
                        'Phone': $("#mobile").val(),
                        'UserId': $("#UserId").val(),
                    };

                    general.doAjax('/home/SaveAddressNewApi', data, function (d) {
                        //general.hideLoader();
                        window.location.href = "/thankyou?id=" + $("#id").val();
                    });
                }

            });

        },
        back = function () {
            $(".first-one").show();
            $(".second-one").hide();
        },
        bindFn = function () {
            general.saveIP(false, "");
            if ($("#mls-id").val() != "") {
                getDetailsOfMLS();
                bindHistoryButton();
                bindValidate();
                gotoDetailPage();

                if ($("#map").length > 0) {
                    bindMap();
                }
                if ($("#reportPage").length == 0) {
                    getFirstIfOther(function (d) {

                    });
                }
            }
            //bindPoupFn();
            bindSubmitButton();
            bindSearchBox();
            bindmonthlyBox();
        },
        bindmonthlyBox = function () {
            $("#monthly-button").click(function () {
                if ($("#email-monthly").val() == "") {
                    alert("please enter Email");
                }
                else if (!isEmail($("#email-monthly").val())) {
                    alert("please enter correct email");
                }
                else {
                    general.showLoader();
                    var data = {
                        'Id': $("#id").val(),
                        'Email': $("#email-monthly").val()
                    };

                    general.doAjax('/home/SaveAddressMonthly', data, function (d) {
                        general.hideLoader();
                        alert("Thank you for your request. We will back to you within 1 business day.");
                    });
                }
            });
        },
        bindSearchBox = function () {
            var input = /** @type {HTMLInputElement} */(document.getElementById('searc-flt'));
            var options = {
                //types: ['(mississauga)'],
                componentRestrictions: { country: "CA" }
            };
            var autocomplete = new google.maps.places.Autocomplete(input, options);
            google.maps.event.addListener(autocomplete, 'place_changed', function () {

                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    return;
                }

                lat = place.geometry.location.lat();
                lng = place.geometry.location.lng();

                $('#Lat').val(lat);
                $('#Lng').val(lng);
                $('#gcontainer1').html(place.adr_address);
            });
        },
        bindSubmitButton = function () {

            $("#submit-info").click(function () {
                $("#emailAskModal").modal();
            });

            $("#btnSubmitEmail").click(function () {
                if ($("#txtNameAsk").val() == "") {
                    $("#txtNameAsk").addClass("error-input");
                } else if ($("#txtEmailAsk").val() == "") {
                    $("#txtNameAsk").removeClass("error-input");
                    $("#txtEmailAsk").addClass("error-input");
                } else {
                    $("#txtNameAsk").removeClass("error-input");
                    $("#txtEmailAsk").removeClass("error-input");

                    general.showLoader();

                    var data = {
                        'Address': $("#FullAddress").val(),
                        'Email': $("#txtEmailAsk").val(),
                        'Name': $("#txtNameAsk").val(),
                        'Id': $("#id").val()
                    };

                    general.doAjax('/home/SaveAddressNewApi', data, function (d) {
                        general.hideLoader();
                        $("#emailAskModal").modal('hide');
                        alert("Thank you for your Home Estimate request. We will send you the Comparative Market Analysis Report within 1 business day.");
                        //$("#emailCompleteModal").modal();
                    });

                }
            });
        },

        getDetailsOfMLS = function () {

            //var saveEstimate = false;
            //if ($(".home-estimate").length > 0) {
            //    saveEstimate = true;
            //}
            var saveEstimateValue = $(".save-estimate-value").html();
            if (saveEstimateValue != undefined) {
                saveEstimateValue = saveEstimateValue.replace("$", "").replace(/,/g, "");
                saveEstimateValue = saveEstimateValue.replace("<span>*</span>", "");
            }
            var data = {
                'MLS': $("#mls-id").val(),
                'AptUnit': $("#AptUnit").val(),
                'StreetNumber': $("#StreetNumber").val(),
                'Address': $("#Address").val(),
                'AddressId': $("#AddressId").val(),
                'Id': $("#id").val(),
                'addB4Logic': $("#addB4Logic").val(),
                'Community': $("#Community").val(),
                'Lat': $("#Lat").val(),
                'Lng': $("#Lng").val(),
                'TaxesUserTyped': $("#TaxesUserTyped").val(),
                //'UpgradedType': $("#Upgraded").val(),
                //'SaveEstimate': saveEstimate,
                'SaveEstimate': true,
                'HomeEstimate': saveEstimateValue
            };

            general.doAjax('/home/getAppreciation', data, function (d) {
                $("#Appreciation").html(d.Appreciation);
                $(".home-estimate").html(d.HomeEstimate + "<span>*</span>");
                $("#GTAAppreciation").html(d.GTAAppreciation);
                $(".moving-avg-spinner").remove();
                $(".moving-avg").html(d.MovingAvgSoldPrice);
            });

            data = {
                'SoldDate': $("#SoldDate").val(),
                'Community': $("#Community").val(),
                'HomeType': $("#HomeType").val(),
                'MunicipalityDistrict': $("#MunicipalityDistrict").val()
            };

            general.doAjax('/home/getNhdInfo', data, function (d) {
                $(".avg-price-spinner").remove();
                $(".avg-price").html(d.AvgPrice);
                $(".avg-days-spinner").remove();
                $(".avg-days").html(d.AvgDaysOnMarket);
                $(".avg-sold-price-spinner").remove();
                $(".avg-sold-price").html(d.AvgSoldPrice);
            });

            general.doAjax('/home/getGraphDataCity', data, function (d) {
                if ($("#chartContainer").length > 0) {
                    bindChart(d);
                }
            });

            data = {
                //'MLS': $("#mls-id").val(),
                'Id': $("#id").val(),
            };

            general.doAjax('/home/listingHistory', data, function (d) {
                $(".listing-history-spinner").remove();
                if (d.CountHome == 0) {
                    $(".listing-history-text").html("This property has never been listed since the year 2003.");
                } else {
                    $(".listing-history-text").html("The property was listed " + d.CountHome + " time (s) since the year 2003.");
                }
            });

        },
        toTimestamp = function (myDate) {
            myDate = myDate.split("-");
            var newDate = myDate[1] + "/" + myDate[0] + "/" + myDate[2];
            return new Date(newDate).getTime();
        },
        bindChart = function (d) {

            var chartData = [];
            var _array = [];

            $.each(d, function (index, value) {
                chartData.push({ x: toTimestamp(value.LastSoldDate), y: parseInt(value.AvgSoldPrice) });
                _array.push(parseInt(value.AvgSoldPrice));
            });


            CanvasJS.addColorSet("customColorSet1",
                [
                    "white"
                ]);

            var chart = new CanvasJS.Chart("chartContainer", {
                backgroundColor: "rgba(0, 0, 0, 0)",
                colorSet: "customColorSet1",
                animationEnabled: true,
                toolTip: {
                    backgroundColor: "#4f77cc",
                    fontColor: "white",
                },
                axisX: {
                    valueFormatString: "MMM-YY",
                    lineColor: "white",
                    tickColor: "#4f77cc",
                    gridColor: "white",
                    labelFontColor: "white",
                    interval: 1,
                    intervalType: "month",
                },
                axisY: {
                    minimum: Math.min.apply(Math, _array) - 10000,
                    prefix: "$",
                    lineColor: "rgba(0, 0, 0, 0)",
                    tickColor: "rgba(0, 0, 0, 0)",
                    gridColor: "white",
                    labelFontColor: "white",

                },
                data: [{
                    type: "spline",
                    connectNullData: true,
                    xValueType: "dateTime",
                    xValueFormatString: "MMM-YY",
                    yValueFormatString: "$####",
                    dataPoints: chartData
                }]
            });
            chart.render();
            $(".graph-spinner").remove();
        },
        bindChartPdf = function (d) {

            var chartData = [];
            var _array = [];

            $.each(d, function (index, value) {
                chartData.push({ x: toTimestamp(value.LastSoldDate), y: parseInt(value.AvgSoldPrice) });
                _array.push(parseInt(value.AvgSoldPrice));
            });


            CanvasJS.addColorSet("customColorSet1",
                [
                    "#75B0DF"
                ]);

            var chart = new CanvasJS.Chart("chartContainer", {
                backgroundColor: "rgba(0, 0, 0, 0)",
                colorSet: "customColorSet1",
                animationEnabled: true,
                toolTip: {
                    backgroundColor: "#4f77cc",
                    fontColor: "white",
                },
                axisX: {
                    valueFormatString: "MMM-YY",
                    lineColor: "#484848",
                    tickColor: "#4f77cc",
                    gridColor: "#484848",
                    labelFontColor: "#484848",
                    interval: 1,
                    intervalType: "month",
                },
                axisY: {
                    minimum: Math.min.apply(Math, _array) - 10000,
                    prefix: "$",
                    lineColor: "rgba(0, 0, 0, 0)",
                    tickColor: "rgba(0, 0, 0, 0)",
                    gridColor: "#484848",
                    labelFontColor: "#484848",

                },
                data: [{
                    type: "spline",
                    connectNullData: true,
                    xValueType: "dateTime",
                    xValueFormatString: "MMM-YY",
                    yValueFormatString: "$####",
                    dataPoints: chartData
                }]
            });
            chart.render();
            $(".graph-spinner").remove();
        },
        bindChartPdfNew = function (data) {
            let ThirdDays = data.filter(a => a.Level5 == "30Days");
            console.log(ThirdDays);
            let SixDays = data.filter(a => a.Level5 == "60Days");
            console.log(SixDays);

            let data1 = [];
            $.each(ThirdDays, function (x, y) {
                var d = {
                    x: new Date(y.Level3, parseInt(y.Level1) - 1, y.Level2),
                    y: parseInt(y.Level4)
                }
                data1.push(d);
            })

            let data2 = [];
            $.each(SixDays, function (x, y) {
                var d = {
                    x: new Date(y.Level3, parseInt(y.Level1) - 1, y.Level2),
                    y: parseInt(y.Level4)
                }
                data2.push(d);
            });



            var chart = new CanvasJS.Chart("chartContainer", {
                //title: {
                //    text: "Greater Toronto Area - "+$("#hometype").val()+" Homes "
                //},
                backgroundColor: "rgba(0, 0, 0, 0)",
                animationEnabled: true,
                toolTip: {
                    backgroundColor: "#4f77cc",
                    fontColor: "white",
                },
                axisX: {
                    valueFormatString: "MMM",
                    lineColor: "#00b5da",
                    tickColor: "#4f77cc",
                    gridColor: "#00b5da",
                    labelFontColor: "#656669",
                    lineThickness: 1,
                },
                axisY: {
                    //title: "Price",
                    prefix: "$",
                    suffix: "K",
                    lineColor: "#00b5da",
                    tickColor: "#4f77cc",
                    gridColor: "#00b5da",
                    labelFontColor: "#656669",
                    labeltextalign: "left",
                    lineThickness: 0,
                    tickThickness: 0,
                    gridThickness: 1,
                    interval : 20000
                },
                toolTip: {
                    shared: true
                },
                //legend: {
                //    cursor: "pointer",
                //    verticalAlign: "top",
                //    horizontalAlign: "center",
                //    dockInsidePlotArea: true
                //},
                data: [{
                    type: "line",
                    //axisYType: "secondary",
                    //name: "Leading Indicator",
                    //showInLegend: true,
                    markerSize: 0,
                    //yValueFormatString: "$#,###k",
                    yValueFormatString: "$#,###,.##K",
                    dataPoints: data1,
                    lineThickness: 4,
                },
                {
                    type: "line",
                    //axisYType: "secondary",
                    //name: "Lagging Indicator",
                    //showInLegend: true,
                    markerSize: 0,
                    //yValueFormatString: "$#,###k",
                    yValueFormatString: "$#,###,.##K",
                    dataPoints: data2,
                    lineThickness: 4,
                }]
            });

            chart.render();


        },
        bindChartPdfLevels = function (data) {
            let ThirdDays = data.filter(a => a.Level5 == "30Days");
            console.log(ThirdDays);
            let SixDays = data.filter(a => a.Level5 == "60Days");
            console.log(SixDays);

            let data1 = [];
            $.each(ThirdDays, function (x, y) {
                var d = {
                    x: new Date(y.Level3, parseInt(y.Level1) - 1, y.Level2),
                    y: parseInt(y.Level4)
                }
                data1.push(d);
            })

            let data2 = [];
            $.each(SixDays, function (x, y) {
                var d = {
                    x: new Date(y.Level3, parseInt(y.Level1) - 1, y.Level2),
                    y: parseInt(y.Level4)
                }
                data2.push(d);
            });



            CanvasJS.addColorSet("customColorSet1",
                [
                    "white"
                ]);

            var chart = new CanvasJS.Chart("chartContainer", {
                //title: {
                //    text: "Greater Toronto Area - "+$("#hometype").val()+" Homes "
                //},
                backgroundColor: "rgba(0, 0, 0, 0)",
                animationEnabled: true,
                toolTip: {
                    backgroundColor: "#4f77cc",
                    fontColor: "white",
                },
                axisX: {
                    valueFormatString: "MMM",
                    lineColor: "#00b5da",
                    tickColor: "#4f77cc",
                    gridColor: "#00b5da",
                    labelFontColor: "#656669",
                    lineThickness: 1,
                },
                axisY: {
                    //title: "Price",
                    prefix: "$",
                    suffix: "K",
                    lineColor: "#00b5da",
                    tickColor: "#4f77cc",
                    gridColor: "#00b5da",
                    labelFontColor: "#656669",
                    labeltextalign: "left",
                    lineThickness: 0,
                    tickThickness: 0,
                    gridThickness: 1
                },
                toolTip: {
                    shared: true
                },
                legend: {
                    cursor: "pointer",
                    verticalAlign: "top",
                    horizontalAlign: "center",
                    dockInsidePlotArea: true
                },
                data: [{
                    type: "line",
                    //axisYType: "secondary",
                    name: "Leading Indicator",
                    showInLegend: true,
                    markerSize: 0,
                    //yValueFormatString: "$#,###k",
                    yValueFormatString: "$#,###,.##K",
                    dataPoints: data1,
                    lineThickness: 3
                },
                {
                    type: "line",
                    //axisYType: "secondary",
                    name: "Lagging Indicator",
                    showInLegend: true,
                    markerSize: 0,
                    //yValueFormatString: "$#,###k",
                    yValueFormatString: "$#,###,.##K",
                    dataPoints: data2,
                    lineThickness: 3
                }]
            });

            chart.render();


        },
        bindChartCity = function (d) {

            var chartData = [];
            var _array = [];

            $.each(d, function (index, value) {
                chartData.push({ x: toTimestamp(value.LastSoldDate), y: parseInt(value.AvgSoldPrice) });
                _array.push(parseInt(value.AvgSoldPrice));
            });


            CanvasJS.addColorSet("customColorSet1",
                [
                    "white"
                ]);

            var chart = new CanvasJS.Chart("chartContainer1", {
                backgroundColor: "rgba(0, 0, 0, 0)",
                colorSet: "customColorSet1",
                animationEnabled: true,
                toolTip: {
                    backgroundColor: "#4f77cc",
                    fontColor: "white",
                },
                axisX: {
                    valueFormatString: "MMM-YY",
                    lineColor: "white",
                    tickColor: "#4f77cc",
                    gridColor: "white",
                    labelFontColor: "white",
                    interval: 1,
                    intervalType: "month",
                },
                axisY: {
                    minimum: Math.min.apply(Math, _array) - 10000,
                    prefix: "$",
                    lineColor: "rgba(0, 0, 0, 0)",
                    tickColor: "rgba(0, 0, 0, 0)",
                    gridColor: "white",
                    labelFontColor: "white",

                },
                data: [{
                    type: "spline",
                    connectNullData: true,
                    xValueType: "dateTime",
                    xValueFormatString: "MMM-YY",
                    yValueFormatString: "$####",
                    dataPoints: chartData
                }]
            });
            chart.render();
            $(".graph-spinner").remove();
        },
        bindPoupFn = function () {

            var json = [];
            var jsonArray = $("#json").val().substring(0, $("#json").val().length - 1).split(';');
            $.each(jsonArray, function (x, y) {
                var obj = new Object();
                var sub = y.split(',');
                $.each(sub, function (x, s) {
                    var xs = s.split(':');
                    obj[xs[0]] = xs[1];
                });

                json.push(obj);
            });

            console.log(json);

            //if ($("#myModal").length > 0) {
            //    $("#myModal").modal();
            //}
            $("#btnRefine").click(function () {
                general.showLoader();
                var data = {
                    'Id': $("#id").val(),
                    'Bedrooms': $("#Bedrooms").val(),
                    'BedroomsPlus': $("#BedroomsPluse").val(),
                    'Washrooms': $("#Washrooms").val(),
                    'ApproxSquareFootage': $("#SquareFootage").val(),
                    'GarageSpaces': $("#GarageSpaces").val(),
                    'Taxes': $("#TaxesNew").val(),
                    'AddTaxCondition': $("#AddTaxCondition").val(),
                };

                general.doAjax('/home/saveValidation', data, function (d) {
                    window.location.reload();
                });
            });

            $("#btnMultiHomeType").click(function () {

                var multiHomeType = $("input[name='multiHomeType']:checked").val();
                if (multiHomeType == undefined || multiHomeType == null || multiHomeType == "") {
                    alert("Please select atleast one home type");
                } else {
                    //$("#myModal").modal('hide');
                    general.showLoader();
                    $.ajax({
                        type: "get",
                        cache: false,
                        url: '/saveUserTypeOfHome',
                        data: {
                            'id': $("#id").val(),
                            'TypeOfHome': multiHomeType
                        },
                        success: function (html) {
                            window.location.reload();
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            // never gets hit until page navigation, which aborts this call
                        }
                    });
                }
            });

            $("#Bedrooms").change(function () {


                $("#BedroomsPluse").html("");
                $("#Washrooms").html("");
                $("#SquareFootage").html("");
                $("#GarageSpaces").html("");
                $("#TaxesNew").html("");

                if ($("#BedroomsPluse").length > 0) {

                    $("#BedroomsPluse").removeAttr("disabled");
                    var val = $(this).val();
                    var bedroomsPluse = [];

                    $("#BedroomsPluse").append("<option value=''>--Select Bedrooms Pluse--</option>");

                    $.each(json, function (x, y) {
                        if (y.BedroomsPluse == val && bedroomsPluse.indexOf(y.BedroomsPluse) < 0) {
                            bedroomsPluse.push(y.BedroomsPluse);
                        }

                        if (x + 1 == json.length) {
                            bedroomsPluse = bedroomsPluse.sort();
                            $.each(bedroomsPluse, function (a, b) {
                                $("#BedroomsPluse").append("<option value=" + b + ">" + b + "</option>");
                            });
                        }
                    });

                } else {
                    $("#Washrooms").removeAttr("disabled");
                    var val = $(this).val();
                    var washrooms = [];

                    $("#Washrooms").append("<option value=''>--Select Washroom--</option>");

                    $.each(json, function (x, y) {
                        if (y.BedRooms == val && washrooms.indexOf(y.Washrooms) < 0) {
                            washrooms.push(y.Washrooms);
                        }

                        if (x + 1 == json.length) {
                            washrooms = washrooms.sort();
                            $.each(washrooms, function (a, b) {
                                console.log(b);
                                $("#Washrooms").append("<option value=" + b + ">" + b + "</option>");
                            });
                        }
                    });
                }

            });

            $("#BedroomsPluse").change(function () {

                $("#Washrooms").html("");
                $("#SquareFootage").html("");
                $("#GarageSpaces").html("");
                $("#TaxesNew").html("");

                $("#Washrooms").removeAttr("disabled");
                var val = $(this).val();
                var washrooms = [];

                $("#Washrooms").append("<option value=''>--Select Washroom--</option>");

                $.each(json, function (x, y) {
                    console.log(y.BedRooms == $("#Bedrooms").val() && y.BedroomsPluse == val);
                    if (y.BedRooms == $("#Bedrooms").val() && y.BedroomsPluse == val && washrooms.indexOf(y.Washrooms) < 0) {
                        washrooms.push(y.Washrooms);
                    }

                    if (x + 1 == json.length) {
                        washrooms = washrooms.sort();
                        $.each(washrooms, function (a, b) {
                            $("#Washrooms").append("<option value=" + b + ">" + b + "</option>");
                        });
                    }
                });
            });

            $("#Washrooms").change(function () {

                $("#SquareFootage").html("");
                $("#GarageSpaces").html("");
                $("#TaxesNew").html("");

                if ($("#SquareFootage").length > 0) {
                    $("#SquareFootage").removeAttr("disabled");
                    var val = $(this).val();
                    var seq = [];
                    $("#SquareFootage").append("<option value=''>--Select Square Footage--</option>");
                    $.each(json, function (x, y) {
                        if (y.BedRooms == $("#Bedrooms").val() && ($("#BedroomsPluse").val() == undefined || y.BedroomsPluse == $("#BedroomsPluse").val()) && y.Washrooms == val && seq.indexOf(y.ApproxSquareFootage) < 0) {
                            seq.push(y.ApproxSquareFootage);
                            $("#SquareFootage").append("<option value=" + y.ApproxSquareFootage + ">" + y.ApproxSquareFootage + "</option>");
                        }
                    });
                }
                else {
                    $("#GarageSpaces").removeAttr("disabled");
                    var val = $(this).val();
                    var GarageSpaces = [];

                    $("#GarageSpaces").append("<option value=''>--Select Garage Spaces--</option>");
                    $.each(json, function (x, y) {
                        if (y.BedRooms == $("#Bedrooms").val() && y.Washrooms == val && GarageSpaces.indexOf(y.GarageSpaces) < 0) {
                            GarageSpaces.push(y.GarageSpaces);

                        }

                        if (x + 1 == json.length) {
                            GarageSpaces = GarageSpaces.sort();
                            $.each(GarageSpaces, function (a, b) {
                                $("#GarageSpaces").append("<option value=" + b + ">" + b + "</option>");
                            });
                        }


                    });
                }
            });

            $("#SquareFootage").change(function () {
                $("#GarageSpaces").removeAttr("disabled");

                $("#GarageSpaces").html("");
                $("#TaxesNew").html("");

                var val = $(this).val();
                var GarageSpaces = [];

                $("#GarageSpaces").append("<option value=''>--Select Garage Spaces--</option>");
                $.each(json, function (x, y) {
                    if (y.BedRooms == $("#Bedrooms").val() && y.ApproxSquareFootage == val && GarageSpaces.indexOf(y.GarageSpaces) < 0) {
                        GarageSpaces.push(y.GarageSpaces);
                    }

                    if (x + 1 == json.length) {
                        GarageSpaces = GarageSpaces.sort();
                        $.each(GarageSpaces, function (a, b) {
                            $("#GarageSpaces").append("<option value=" + b + ">" + b + "</option>");
                        });
                    }
                });
            });

            $("#GarageSpaces").change(function () {
                $("#TaxesNew").removeAttr("disabled");

                $("#TaxesNew").html("");

                var val = $(this).val();
                var Taxes = [];

                $("#TaxesNew").append("<option value=''>--Select Taxes--</option>");
                $.each(json, function (x, y) {
                    if (y.BedRooms == $("#Bedrooms").val() && y.GarageSpaces == val && Taxes.indexOf(y.TaxesNew) < 0) {
                        Taxes.push(y.TaxesNew);
                        $("#TaxesNew").append("<option value=" + y.TaxesNew + ">" + y.TaxesNew + "</option>");
                    }
                });
            });
        },
        bindHistoryButton = function () {
            $(".history-btn-1").click(function () {
                general.showLoader();
                var data = {
                    //'MLS': $("#mls-id").val(),
                    'Id': $("#id").val(),
                };

                general.doAjax('/home/getListingHistory', data, function (d) {

                    var html = "";

                    $.each(d, function (index, value) {
                        html += '<small>' + value.LastSoldDate + '</small><li>' + value.LastStatus + '<span>' + value.LastSoldPrice + '</span></li>';
                    });

                    $(".listing-history-data-li").html(html);
                    general.hideLoader();
                    $("#listingHistoryModal").modal();
                });
            });
        },
        bindValidate = function () {
            if ($("#ShowPopup").val() == "True" || $("#ShowPopup").val() == "true") {
                $("#validateModal").modal();
            }
        },
        saveUserOption = function (UserOption) {
            general.showLoader();
            var data = {
                'Id': $("#id").val(),
                'UserOption': UserOption
            };

            general.doAjax('/home/saveUserOption', data, function (d) {
                $(".agree-estimate").hide();
                general.hideLoader();
            });
        },
        gotoDetailPage = function () {
            $("#detail-btn,#detail-btn-1").click(function () {
                general.showLoader();
                var mls = $("#mls-id").val();
                if ($("#mls-id-new").val() != undefined && $("#mls-id-new").val() != "") {
                    mls = $("#mls-id-new").val();
                }
                var id = $("#id").val();
                window.location.href = "/details?MLS=" + mls + "&id=" + id + "&from=details";
            });
        },
        bindRadioBtn = function () {
            $(".checkcontainer").click(function () {

            });

        },
        bindMap = function () {
            var mapOptions = {
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById('map'),
                mapOptions);
            map.setCenter(new google.maps.LatLng($("#Lat").val(), $("#Lng").val()))
            map.set('styles', [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#009ed0" }, { "lightness": 14 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#74b74a" }, { "lightness": 28 }] }, { "featureType": "poi.business", "elementType": "geometry", "stylers": [{ "color": "#f1de4a" }, { "lightness": 47 }] }, { "featureType": "poi.school", "elementType": "geometry", "stylers": [{ "color": "#f1de4a" }, { "lightness": 47 }] }, { "featureType": "poi.attraction", "elementType": "geometry", "stylers": [{ "color": "#f1de4a" }, { "lightness": 47 }] }, { "featureType": "poi.medical", "stylers": [{ "color": "#f1de4a" }, { "lightness": 47 }] }, { "featureType": "poi.sports_complex", "stylers": [{ "color": "#f1de4a" }, { "lightness": 47 }] }]);

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng($("#Lat").val(), $("#Lng").val()),
                map: map,
                icon: "/content/img/map-blue.png"
            });

            getMapHomesMulti();
        },
        getMapHomesMulti = function () {
            var UserId = $("#UserId").val();
            var registeredUser = false;
            if (UserId != undefined && UserId != null && UserId != "") {
                registeredUser = true;
            }

            if ($("#reportPage").length == 0) {
                getFirstIfOther(function (d) {
                    if (d != null && d != "") {
                        $("#mls-id-new").val(d.MLS);
                        indexMapHome = indexMapHome + 1;
                        d.Lng = d.Long;
                        d.Address = d.Address + ", " + d.MunicipalityDistrict;
                        bindMarker(d, indexMapHome, registeredUser);
                    }
                });
            }


            if ($("#reportPage").length == 0) {
                indexMapHome = indexMapHome + 1;
                getFirstHome(registeredUser, indexMapHome);
            }
            // else{
            //     if($("#C1MLS").val() == ""){
            //         indexMapHome = indexMapHome + 1;
            //         getFirstHome(registeredUser, indexMapHome);
            //     }
            // }
            getMapHomes(registeredUser);

        },
        getFirstIfOther = function (callback) {
            var data = {
                'MLS': $("#mls-id").val(),
                'AptUnit': $("#AptUnit").val(),
                'StreetNumber': $("#StreetNumber").val(),
                'Address': $("#Address").val(),
                'AddressId': $("#AddressId").val(),
                'Id': $("#id").val(),
            };

            general.doAjax('/home/getFirstMLSIfOther', data, function (d) {
                $(".btn-cgs").hide();
                $(".accurate-home.accurate-home-mobile-view").show();
                $(".property-custom .see-history").show();
                callback(d);
            });
        },
        getFirstHome = function (registeredUser, indexMapHome) {
            var data = {
                'MLS': $("#mls-id").val()
            };
            if ($("#mls-id").val() != "") {
                general.doAjax('/home/getMLSdetails', data, function (d) {
                    d.Lng = d.Long;
                    d.Address = d.Address + ", " + d.MunicipalityDistrict;
                    bindMarker(d, indexMapHome, registeredUser);
                });
            }

        },
        getMapHomes = function (registeredUser) {
            var data = {
                'MLS': $("#mls-id").val(),
                'Id': $("#id").val(),
                'addB4Logic': $("#addB4Logic").val(),
                'ChangeHomefn': $("#ChangeHomefn").val(),
                'MunicipalityDistrict': $("#MunicipalityDistrict").val()
            };

            var url = '/home/getAddressMapData';
            if ($("#reportPage").length > 0) {
                if ($("#mls-id").val() == "") {
                    data.MLS = $("#mls-id-for-compare").val();
                }

                data.ChangeHomefn = $("#ChangeHomefn").val();
                data.SoldMapStartDate = $("#SoldMapStartDate").val();
                data.SoldMapEndDate = $("#SoldMapEndDate").val();
                data.SoldMapMinPrice = $("#SoldMapMinPrice").val();
                data.SoldMapMaxPrice = $("#SoldMapMaxPrice").val();


                data.SoldMapGaraazMin = $("#SoldMapGaraazMin").val();
                data.SoldMapParkingMin = $("#SoldMapParkingMin").val();
                data.SoldMapBedroomsMin = $("#SoldMapBedroomsMin").val();
                data.SoldMapBedroomsMax = $("#SoldMapBedroomsMax").val();
                data.SoldMapWashroomsMin = $("#SoldMapWashroomsMin").val();
                data.SoldMapWashroomsMax = $("#SoldMapWashroomsMax").val();
                data.SoldMapApproxSeqMin = $("#SoldMapApproxSeqMin").val();
                data.TaxMin = $("#TaxMin").val();
                data.TaxMax = $("#TaxMax").val();
                data.MLSCompare1 = $("#MLSCompare1").val();
                data.MLSCompare2 = $("#MLSCompare2").val();
                data.SameStreetName = $("#SameStreetName:checked").length > 0 ? true : false;
                data.SameStreetAddress = $("#SameStreetAddress:checked").length > 0 ? true : false;
                data.HomeType = $("#HomeType").val();
                data.MunicipalityDistrict = $("#MunicipalityDistrict").val();

                url = '/home/getAddressMapDataForReport';
            }
            general.doAjax(url, data, function (d) {
                $("#ChangeHomefn").val("false");
                $.each(d, function (index, value) {
                    value.Address = (value.AptUnit != null && value.AptUnit != "" ? value.AptUnit + "-" : "") + value.StreetNumber + ' ' + value.Address;
                    value.MLS = value.MLSID;
                    indexMapHome = indexMapHome + 1;
                    bindMarker(value, indexMapHome, registeredUser);

                    if ($("#reportPage").length > 0 && (index == 0 || index == 1)) {

                        if ($("#mls-id").val() == "") {
                            map.setCenter(new google.maps.LatLng(value.Lat, value.Lng));
                        }

                        bindC2AndC3(value, index);
                    }
                });

                $("#loader-map").hide();
            });
        },
        bindMapDataReportSaved = function () {
            $.each(markers, function (ind, marker) {
                marker.setMap(null);
            });
            indexMapHome = 0;
            getMapHomes(true);
        },
        bindC2AndC3 = function (dd, index) {

            var datas = {
                'MLS': dd.MLS
            };
            console.log(dd.MLS);
            console.log("index==" + index);

            general.doAjax('/home/getMLSdetails', datas, function (d) {

                var data = d;

                var date1 = new Date();
                date1.setMonth(date1.getMonth() - 24);

                var date2 = new Date(d.UpdatedDate);

                if (date2.getTime() < date1.getTime()) {
                    var html = "<div class='slider-" + (index + 1) + "'>";
                    var html1 = "<div class='slider-full-" + (index + 1) + "'>";

                    for (var i = 1; i < 12; i++) {
                        html += "<div class='custom-img' style='width: 220px!important; ;height: 150px!important;'><img style='width: 220px!important; ;height: 150px!important;' onerror='$(this).parents('.custom-img').remove();' src='/mlsImage?mls=" + d.MLS + "&number=" + i + "' alt='gr' /></div>";
                        html1 += "<div class='custom-img'><img onerror='$(this).parents('.custom-img').remove();' src='/mlsImage?mls=" + d.MLS + "&number=" + i + "' alt='gr' /></div>";
                    }
                    html += "</div>";
                    html1 += "</div>";
                    
                    $(".compareable-table thead tr").append('<th>' + html + '</th>');
                    $(".home-c" + (index + 2) + " .custom-img").html(html1);

                    
                    $('.slider-' + (index + 1)).bxSlider({
                        slideWidth: 220
                    });

                    $('.slider-full-' + (index + 1)).bxSlider();

                } else {
                    var html = "<div class='slider-" + (index + 1) + "'>";
                    var html1 = "<div class='slider-full-" + (index + 1) + "'>";

                    for (var i = 1; i < 12; i++) {
                        html += "<div class='custom-img' style='width: 220px!important; ;height: 150px!important;'><img style='width: 220px!important; ;height: 150px!important;' onerror='$(this).parents('.custom-img').remove();' src='https://homeoptimaimages.s3.amazonaws.com/Photo" + d.MLS + "-" + i + "' alt='gr' /></div>";
                        html1 += "<div class='custom-img'><img onerror='$(this).parents('.custom-img').remove();' src='https://homeoptimaimages.s3.amazonaws.com/Photo" + d.MLS + "-" + i + "' alt='gr' /></div>";
                    }
                    html += "</div>";
                    html1 += "</div>";

                    $(".compareable-table thead tr").append('<th>' + html + '</th>');
                    $(".home-c" + (index + 2) + " .custom-img").html(html1);

                    $('.slider-' + (index + 1)).bxSlider({
                        slideWidth: 220
                    });

                    $('.slider-full-' + (index + 1)).bxSlider();
                }



                var image = '<img onerror="homeEstimate.changeImage(this)" src="' + data.Image + '" alt="">';

                //compare page
                console.log("compare homes");


                //$(".compareable-table thead tr").append('<th><img style="width:220px;height: 150px;" src="' + data.Image + '" alt=""></th>');


                $(".compareable-table tbody tr.sale-price-tr").append("<td>" + data.SoldPrice + "</td>");
                $(".compareable-table tbody tr.mls-tr").append("<td>" + data.MLS + "</td>");
                $(".compareable-table tbody tr.sale-date-tr").append("<td>" + data.SoldDate + "</td>");
                $(".compareable-table tbody tr.address-tr").append("<td><a href='/details?MLS=" + data.MLS + "&id=1' target='_blank'>" + data.Address + "</a></td>");
                $(".compareable-table tbody tr.property-tr").append("<td>" + data.Type + "</td>");


                //$(".compareable-table tbody tr.taxes-tr").append("<td>" + data.Taxes + "</td>");
                //$(".compareable-table tbody tr.taxes-year-tr").append("<td>" + data.TaxYear + "</td>");
                //$(".compareable-table tbody tr.garaaz-space-tr").append("<td>" + data.GarageSpaces + "</td>");
                //$(".compareable-table tbody tr.parking-space-tr").append("<td>" + data.ParkingSpaces + "</td>");
                //$(".compareable-table tbody tr.maintenance-tr").append("<td>" + data.Maintenance + "</td>");
                //$(".compareable-table tbody tr.seq-footage-tr").append("<td>" + data.ApproxSquareFootage + "</td>");

                if ($("#hdnTaxes" + (index + 1)).val() == "") {
                    $(".compareable-table tbody tr.taxes-tr").append("<td><input type='text' class='form-control my-control' id='Taxes" + (index + 1) + "' value='" + data.Taxes + "' /></td>");
                } else {
                    $(".compareable-table tbody tr.taxes-tr").append("<td><input type='text' class='form-control my-control' id='Taxes" + (index + 1) + "' value='" + $("#hdnTaxes" + (index + 1)).val() + "' /></td>");
                }

                if ($("#hdnTaxYear" + (index + 1)).val() == "") {
                    $(".compareable-table tbody tr.taxes-year-tr").append("<td><input type='text' class='form-control my-control' id='TaxYear" + (index + 1) + "' value='" + data.TaxYear + "' /></td>");
                } else {
                    $(".compareable-table tbody tr.taxes-year-tr").append("<td><input type='text' class='form-control my-control' id='TaxYear" + (index + 1) + "' value='" + $("#hdnTaxYear" + (index + 1)).val() + "' /></td>");
                }

                if ($("#hdnGarage" + (index + 1)).val() == "") {
                    $(".compareable-table tbody tr.garaaz-space-tr").append("<td><input type='text' class='form-control my-control' id='Garage" + (index + 1) + "' value='" + data.GarageSpaces + "' /></td>");
                } else {
                    $(".compareable-table tbody tr.garaaz-space-tr").append("<td><input type='text' class='form-control my-control' id='Garage" + (index + 1) + "' value='" + $("#hdnGarage" + (index + 1)).val() + "' /></td>");
                }

                if ($("#hdnParkingSpaces" + (index + 1)).val() == "") {
                    $(".compareable-table tbody tr.parking-space-tr").append("<td><input type='text' class='form-control my-control' id='ParkingSpaces" + (index + 1) + "' value='" + data.ParkingSpaces + "' /></td>");
                } else {
                    $(".compareable-table tbody tr.parking-space-tr").append("<td><input type='text' class='form-control my-control' id='ParkingSpaces" + (index + 1) + "' value='" + $("#hdnParkingSpaces" + (index + 1)).val() + "' /></td>");
                }

                if ($("#hdnMaintenance" + (index + 1)).val() == "") {
                    $(".compareable-table tbody tr.maintenance-tr").append("<td><input type='text' class='form-control my-control' id='Maintenance" + (index + 1) + "' value='" + data.Maintenance + "' /></td>");
                } else {
                    $(".compareable-table tbody tr.maintenance-tr").append("<td><input type='text' class='form-control my-control' id='Maintenance" + (index + 1) + "' value='" + $("#hdnMaintenance" + (index + 1)).val() + "' /></td>");
                }

                if ($("#hdnSquareFootage" + (index + 1)).val() == "") {
                    $(".compareable-table tbody tr.seq-footage-tr").append("<td><input type='text' class='form-control my-control' id='SquareFootage" + (index + 1) + "' value='" + data.ApproxSquareFootage + "' /></td>");
                } else {
                    $(".compareable-table tbody tr.seq-footage-tr").append("<td><input type='text' class='form-control my-control' id='SquareFootage" + (index + 1) + "' value='" + $("#hdnSquareFootage" + (index + 1)).val() + "' /></td>");
                }  

                if ($("#hdnMPACAdj" + (index + 1)).val() == "") {
                    var market = "";
                    console.log("in fn");
                    var taxes = $("#Taxes0").val();
                    if (taxes != "") {
                        taxes = parseInt(taxes);
                        console.log(taxes);
                        console.log("in fn1");

                        var taxes1 = $("#Taxes" + (index + 1)).val();
                        if (taxes1 != "") {
                            taxes1 = parseInt(taxes1);
                            console.log("in fn2");
                            console.log(taxes1);
                            var soldPrice = parseInt(data.SoldPrice.replace("$", "").replace(/,/g, ""));
                            console.log(soldPrice);
                            console.log("in fn3");
                            market = ((1 - (taxes / taxes1)) * soldPrice).toFixed(2);
                            console.log(market);
                            console.log("in fn4");
                        }
                    }


                    $(".compareable-table tbody tr.mpac-tr").append("<td><input type='text' class='form-control my-control' id='MPACAdj" + (index + 1) + "' value='" + market + "' /></td>");
                } else {
                    $(".compareable-table tbody tr.mpac-tr").append("<td><input type='text' class='form-control my-control' id='MPACAdj" + (index + 1) + "' value='" + $("#hdnMPACAdj" + (index + 1)).val() + "' /></td>");
                }
                
                


                $(".compareable-table tbody tr.year-tr").append("<td><input type='text' class='form-control my-control' id='Yearbuilt" + (index + 1) + "' value='" + $("#hdnYearbuilt" + (index + 1)).val() + "' /></td>");

                if ($("#hdnHalfBathroom" + (index + 1)).val() == "") {
                    $(".compareable-table tbody tr.half-bath-tr").append("<td><input type='text' class='form-control my-control' style='width: 100%;' id='HalfBathroom" + (index + 1) + "' value='" + data.WashroomsType + "' /></td>");
                } else {
                    $(".compareable-table tbody tr.half-bath-tr").append("<td><input type='text' class='form-control my-control' style='width: 100%;' id='HalfBathroom" + (index + 1) + "' value='" + $("#hdnHalfBathroom" + (index + 1)).val() + "' /></td>");
                }


                if ($("#hdnBedroom" + (index + 1)).val() == "") {
                    $(".compareable-table tbody tr.bedroom-tr").append("<td><input type='text' class='form-control my-control' id='Bedroom" + (index + 1) + "' value='" + data.Bedrooms + (data.BedroomsPluse != "" ? "+" + data.BedroomsPluse : "") + "' /></td>");
                } else {
                    $(".compareable-table tbody tr.bedroom-tr").append("<td><input type='text' class='form-control my-control' id='Bedroom" + (index + 1) + "' value='" + $("#hdnBedroom" + (index + 1)).val() + "' /></td>");
                }

                if ($("#hdnBathroom" + (index + 1)).val() == "") {
                    $(".compareable-table tbody tr.bath-tr").append("<td><input type='text' class='form-control my-control' id='Bathroom" + (index + 1) + "' value='" + data.Washrooms + "' /></td>");
                } else {
                    $(".compareable-table tbody tr.bath-tr").append("<td><input type='text' class='form-control my-control' id='Bathroom" + (index + 1) + "' value='" + $("#hdnBathroom" + (index + 1)).val() + "' /></td>");
                }

                if ($("#hdnLotFront" + (index + 1)).val() == "") {
                    $(".compareable-table tbody tr.front-tr").append("<td><input type='text' class='form-control my-control' id='LotFront" + (index + 1) + "' value='" + data.LotFront + "' /></td>");
                } else {
                    $(".compareable-table tbody tr.front-tr").append("<td><input type='text' class='form-control my-control' id='LotFront" + (index + 1) + "' value='" + $("#hdnLotFront" + (index + 1)).val() + "' /></td>");
                }

                if ($("#hdnLotDepth" + (index + 1)).val() == "") {
                    $(".compareable-table tbody tr.depth-tr").append("<td><input type='text' class='form-control my-control' id='LotDepth" + (index + 1) + "' value='" + data.Lot_Depth + "' /></td>");
                } else {
                    $(".compareable-table tbody tr.depth-tr").append("<td><input type='text' class='form-control my-control' id='LotDepth" + (index + 1) + "' value='" + $("#hdnLotDepth" + (index + 1)).val() + "' /></td>");
                }

                if ($("#hdnSiteArea" + (index + 1)).val() == "") {
                    $(".compareable-table tbody tr.site-area-tr").append("<td><input type='text' class='form-control my-control' id='SiteArea" + (index + 1) + "' value='" + (parseFloat(data.LotFront * data.Lot_Depth).toFixed(2)) + "' /></td>");
                } else {
                    $(".compareable-table tbody tr.site-area-tr").append("<td><input type='text' class='form-control my-control' id='SiteArea" + (index + 1) + "' value='" + $("#hdnSiteArea" + (index + 1)).val() + "' /></td>");
                }




                $(".compareable-table tbody tr.total-floor-tr").append("<td><input type='text' class='form-control my-control' id='TotalFloorArea" + (index + 1) + "' value='" + $("#hdnTotalFloorArea" + (index + 1)).val() + "' /></td>");
                $(".compareable-table tbody tr.kitchen-tr").append("<td><input type='text' class='form-control my-control' id='Kitchen" + (index + 1) + "' value='" + $("#hdnKitchen" + (index + 1)).val() + "' /></td>");
                
                if ($("#hdnKitchen" + (index + 1)).val() == "") {
                    if (data.KitchensPlus != null && data.KitchensPlus != "" && data.Kitchen != "") {
                        $("#Kitchen" + (index + 1)).val(data.Kitchen + "+" + data.KitchensPlus);
                    }
                    else if (data.KitchensPlus != null && data.KitchensPlus != "") {
                        $("#Kitchen" + (index + 1)).val("1+"+ data.KitchensPlus);
                    }
                    else {
                        $("#Kitchen" + (index + 1)).val(data.Kitchen!="" ? data.Kitchen : "1");
                    }
                }

                $(".compareable-table tbody tr.washrom-tr").append("<td><input type='text' class='form-control my-control' id='NWashrooms" + (index + 1) + "' value='" + $("#hdnNWashrooms" + (index + 1)).val() + "' /></td>");
                $(".compareable-table tbody tr.flooing-tr").append("<td><input type='text' class='form-control my-control' id='Flooring" + (index + 1) + "' value='" + $("#hdnFlooring" + (index + 1)).val() + "' /></td>");
                $(".compareable-table tbody tr.basement-tr").append("<td><input type='text' class='form-control my-control' id='NBasement" + (index + 1) + "' value='" + $("#hdnNBasement" + (index + 1)).val() + "' /></td>");

                if ($("#hdnNBasement" + (index + 1)).val() == "") {

                    if (data.Basement2 != null && data.Basement2 != "") {
                        $("#NBasement" + (index + 1)).val(data.Basement1 + "/" + data.Basement2);
                    }
                    else {
                        $("#NBasement" + (index + 1)).val(data.Basement1);
                    }
                }

                $(".compareable-table tbody tr.backyard-tr").append("<td><input type='text' class='form-control my-control' id='Backyard" + (index + 1) + "' value='" + $("#hdnBackyard" + (index + 1)).val() + "' /></td>");
                $(".compareable-table tbody tr.appliances-tr").append("<td><input type='text' class='form-control my-control' id='Appliances" + (index + 1) + "' value='" + $("#hdnAppliances" + (index + 1)).val() + "' /></td>");
                $(".compareable-table tbody tr.roof-tr").append("<td><input type='text' class='form-control my-control' id='RoofAirConditioner" + (index + 1) + "' value='" + $("#hdnRoofAirConditioner" + (index + 1)).val() + "' /></td>");

                $(".compareable-table tbody tr.market-per-adustment-tr").append("<td><input type='text' class='form-control my-control' id='MarketPerAdjustmentPrice" + (index + 1) + "' value='" + $("#hdnMarketPerAdjustmentPrice" + (index + 1)).val() + "' /></td>");
                $(".compareable-table tbody tr.market-adustment-tr").append("<td><input type='text' class='form-control my-control' style='width: 100%' readonly id='MarketAdjustmentPrice" + (index + 1) + "' value='" + $("#hdnMarketAdjustmentPrice" + (index + 1)).val() + "' /></td>");


                $(".compareable-table tbody tr.adustment-tr").append("<td><textarea style='height: 200px;' class='form-control my-control-new' data-toggle='tooltip' title='" + data.RemarksForClients + "' id='Adjustments" + (index + 1) + "'>" + $("#hdnAdjustments" + (index + 1)).val() + "</textarea > </td>");

                $(".compareable-table tbody tr.total-adustment-tr").append("<td><input type='text' class='form-control my-control' style='width: 100%' id='TotalAdjustments" + (index + 1) + "' value='" + $("#hdnTotalAdjustments" + (index + 1)).val() + "' /></td>");
                //$(".compareable-table tbody tr.total-adustment-tr").append("<td><textarea class='form-control my-control-new' id='TotalAdjustments" + (index + 1) + "'>" + $("#hdnTotalAdjustments" + (index + 1)).val() + "</textarea> </td>");

                $(".compareable-table tfoot tr.adj-price-tr").append("<td><input type='text' class='form-control my-control' style='width: 100%' readonly id='AdjustmentPrice" + (index + 1) + "' value='" + $("#hdnAdjustmentPrice" + (index + 1)).val() + "' /></td>");

                //$(".home-c" + (index + 2) + " .custom-img").html(image);

                $(".list-price-c" + (index + 2)).html(data.ListPrice);
                $(".sold-price-c" + (index + 2)).html(data.SoldPrice);
                $(".beds-c" + (index + 2)).html(data.Bedrooms + (data.BedroomsPluse != "" ? "+" + data.BedroomsPluse : ""));
                $(".baths-c" + (index + 2)).html(data.Washrooms);
                $(".wash-c" + (index + 2)).html(data.WashroomsType);
                $(".type-c" + (index + 2)).html(data.Type);
                $(".days-c" + (index + 2)).html(data.DaysOnMarket);
                $(".sold-on-c" + (index + 2)).html("Sold On " + data.SoldDate);
                $(".address-c" + (index + 2)).html(data.Address);
                $(".desc-c" + (index + 2)).html(data.RemarksForClients);
                $(".extra-c" + (index + 2)).html(data.Extras);
                $(".lot-size-c" + (index + 2)).html(data.Lot_Depth + "x" + data.LotFront);
                $(".sq-c" + (index + 2)).html(data.ApproxSquareFootage);
                $(".basement-c" + (index + 2)).html(data.Basement1);
                $(".parking-c" + (index + 2)).html(data.ParkingSpaces);
                $(".garage-space-c" + (index + 2)).html(data.GarageSpaces);

                report.bindTooltip();
                report.getKeywords(function (keywords_1) {



                    $.each(keywords_1, function (index111, element) {

                        report.highlight(element.Name, $(".desc-c" + (index + 2)), index + 2);

                    });
                });

                if (d.Room1 != "") {
                    var x = '<tr><td>' + d.Room1 + '</td><td>' + d.Level1 + '</td><td>' + ((parseFloat(d.Room1Length) * 3.28)).toFixed(2) + " X " + ((parseFloat(d.Room1Width) * 3.28)).toFixed(2) + '</td><td>' + d.Room1Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room2 != "") {
                    var x = '<tr><td>' + d.Room2 + '</td><td>' + d.Level2 + '</td><td>' + ((parseFloat(d.Room2Length) * 3.28)).toFixed(2) + " X " + ((parseFloat(d.Room2Width) * 3.28)).toFixed(2) + '</td><td>' + d.Room2Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room3 != "") {
                    var x = '<tr><td>' + d.Room3 + '</td><td>' + d.Level3 + '</td><td>' + ((parseFloat(d.Room3Length) * 3.28)).toFixed(2) + " X " + ((parseFloat(d.Room3Width) * 3.28)).toFixed(2) + '</td><td>' + d.Room3Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room4 != "") {
                    var x = '<tr><td>' + d.Room4 + '</td><td>' + d.Level4 + '</td><td>' + ((parseFloat(d.Room4Length) * 3.28)).toFixed(2) + " X " + ((parseFloat(d.Room4Width) * 3.28)).toFixed(2) + '</td><td>' + d.Room4Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room5 != "") {
                    var x = '<tr><td>' + d.Room5 + '</td><td>' + d.Level5 + '</td><td>' + ((parseFloat(d.Room5Length) * 3.28)).toFixed(2) + " X " + ((parseFloat(d.Room5Width) * 3.28)).toFixed(2) + '</td><td>' + d.Room5Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room6 != "") {
                    var x = '<tr><td>' + d.Room6 + '</td><td>' + d.Level6 + '</td><td>' + ((parseFloat(d.Room6Length) * 3.28)).toFixed(2) + " X " + ((parseFloat(d.Room6Width) * 3.28)).toFixed(2) + '</td><td>' + d.Room6Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room7 != "") {
                    var x = '<tr><td>' + d.Room7 + '</td><td>' + d.Level7 + '</td><td>' + ((parseFloat(d.Room7Length) * 3.28)).toFixed(2) + " X " + ((parseFloat(d.Room7Width) * 3.28)).toFixed(2) + '</td><td>' + d.Room7Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room8 != "") {
                    var x = '<tr><td>' + d.Room8 + '</td><td>' + d.Level8 + '</td><td>' + ((parseFloat(d.Room8Length) * 3.28)).toFixed(2) + " X " + ((parseFloat(d.Room8Width) * 3.28)).toFixed(2) + '</td><td>' + d.Room8Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room9 != "") {
                    var x = '<tr><td>' + d.Room9 + '</td><td>' + d.Level9 + '</td><td>' + ((parseFloat(d.Room9Length) * 3.28)).toFixed(2) + " X " + ((parseFloat(d.Room9Width) * 3.28)).toFixed(2) + '</td><td>' + d.Room9Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room10 != "") {
                    var x = '<tr><td>' + d.Room10 + '</td><td>' + d.Level10 + '</td><td>' + ((parseFloat(d.Room10Length) * 3.28)).toFixed(2) + " X " + ((parseFloat(d.Room10Width) * 3.28)).toFixed(2) + '</td><td>' + d.Room10Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room11 != "") {
                    var x = '<tr><td>' + d.Room11 + '</td><td>' + d.Level11 + '</td><td>' + ((parseFloat(d.Room11Length) * 3.28)).toFixed(2) + " X " + ((parseFloat(d.Room11Width) * 3.28)).toFixed(2) + '</td><td>' + d.Room11Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room12 != "") {
                    var x = '<tr><td>' + d.Room12 + '</td><td>' + d.Level12 + '</td><td>' + ((parseFloat(d.Room12Length) * 3.28)).toFixed(2) + " X " + ((parseFloat(d.Room12Width) * 3.28)).toFixed(2) + '</td><td>' + d.Room12Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }


                /*if (d.Room1 != "") {
                    var x = '<tr><td>' + d.Room1 + '</td><td>' + d.Level1 + '</td><td>' + d.Room1Length + ' X ' + d.Room1Width + '</td><td>' + d.Room1Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room2 != "") {
                    var x = '<tr><td>' + d.Room2 + '</td><td>' + d.Level2 + '</td><td>' + d.Room2Length + ' X ' + d.Room2Width + '</td><td>' + d.Room2Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room3 != "") {
                    var x = '<tr><td>' + d.Room3 + '</td><td>' + d.Level3 + '</td><td>' + d.Room3Length + ' X ' + d.Room3Width + '</td><td>' + d.Room3Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room4 != "") {
                    var x = '<tr><td>' + d.Room4 + '</td><td>' + d.Level4 + '</td><td>' + d.Room4Length + ' X ' + d.Room4Width + '</td><td>' + d.Room4Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room5 != "") {
                    var x = '<tr><td>' + d.Room5 + '</td><td>' + d.Level5 + '</td><td>' + d.Room5Length + ' X ' + d.Room5Width + '</td><td>' + d.Room5Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room6 != "") {
                    var x = '<tr><td>' + d.Room6 + '</td><td>' + d.Level6 + '</td><td>' + d.Room6Length + ' X ' + d.Room6Width + '</td><td>' + d.Room6Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room7 != "") {
                    var x = '<tr><td>' + d.Room7 + '</td><td>' + d.Level7 + '</td><td>' + d.Room7Length + ' X ' + d.Room7Width + '</td><td>' + d.Room7Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room8 != "") {
                    var x = '<tr><td>' + d.Room8 + '</td><td>' + d.Level8 + '</td><td>' + d.Room8Length + ' X ' + d.Room8Width + '</td><td>' + d.Room8Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room9 != "") {
                    var x = '<tr><td>' + d.Room9 + '</td><td>' + d.Level9 + '</td><td>' + d.Room9Length + ' X ' + d.Room9Width + '</td><td>' + d.Room9Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room10 != "") {
                    var x = '<tr><td>' + d.Room10 + '</td><td>' + d.Level10 + '</td><td>' + d.Room10Length + ' X ' + d.Room10Width + '</td><td>' + d.Room10Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room11 != "") {
                    var x = '<tr><td>' + d.Room11 + '</td><td>' + d.Level11 + '</td><td>' + d.Room11Length + ' X ' + d.Room11Width + '</td><td>' + d.Room11Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }

                if (d.Room12 != "") {
                    var x = '<tr><td>' + d.Room12 + '</td><td>' + d.Level12 + '</td><td>' + d.Room12Length + ' X ' + d.Room12Width + '</td><td>' + d.Room12Desc1 + '</td></tr>';
                    $(".rooms-c" + (index + 2)).append(x);
                }*/


                var dataH = {
                    'SoldDate': d.SoldDate,
                    'Type': d.Type
                };

                var soldPrice = parseInt(d.SoldPrice.replace("$", "").replace(/,/g, ""));
                console.log(soldPrice);
                if(soldPrice == "" || d.SoldPrice == "" || d.SoldPrice == "$" || soldPrice == NaN){
                    soldPrice = "0"
                }
                $("#MarketPerAdjustmentPrice" + (index + 1)).attr("sold-price", soldPrice);

                if ($("#MarketPerAdjustmentPrice" + (index + 1)).val() == "") {
                    general.doAjax('/home/GetAppreciationNew', dataH, function (dd) {
                        var nvalue = dd.Appreciation > 0 ? parseInt((soldPrice * parseFloat(dd.Appreciation)) / 100) : 0;
                        $("#MarketPerAdjustmentPrice" + (index + 1)).val(dd.Appreciation + "%");


                        general.doAjax('/home/DoFormat?number=' + nvalue, null, function (dd1) {
                            if(dd1 == "$"){
                                $("#MarketAdjustmentPrice" + (index + 1)).val("$0");
                            }else{
                                $("#MarketAdjustmentPrice" + (index + 1)).val(dd1);
                            }
                            


                            if ($("#TotalAdjustments" + (index + 1)).val() != "") {
                                soldPrice = soldPrice + parseInt($("#TotalAdjustments" + (index + 1)).val().replace("$", "").replace(/,/g, ""));
                            }

                            console.log(soldPrice);

                            if ($("#MarketAdjustmentPrice" + (index + 1)).val() != "") {
                                soldPrice = soldPrice + parseInt($("#MarketAdjustmentPrice" + (index + 1)).val().replace("$", "").replace(/,/g, ""));
                            }

                            console.log(soldPrice);

                            general.doAjax('/home/DoFormat?number=' + soldPrice, null, function (dd1) {
                                $("#AdjustmentPrice" + (index + 1)).val(dd1);

                                if (soldPrice > 0) {

                                    var fprice = $("#AdjustmentPrice1").val();
                                    var sprice = $("#AdjustmentPrice2").val();
                                    console.log(fprice);
                                    console.log(sprice);

                                    var total = 0;
                                    if (fprice != undefined && fprice != "" && sprice != undefined && sprice != "") {
                                        total = total + parseInt(fprice.replace("$", "").replace(/,/g, ""));
                                        console.log(total);
                                        total = total + parseInt(sprice.replace("$", "").replace(/,/g, ""));
                                        console.log(total);
                                        total = total / 2;
                                        console.log(total);

                                        general.doAjax('/home/DoFormat?number=' + total, null, function (dd1) {
                                            $("#AdjustmentPrice").val(dd1);

                                            if ($("#buyerReportPage").length > 0) {
                                                console.log("hi yes its called");
                                                var str = $("#Conclusions").val();
                                                $("#Conclusions1").html($("#Conclusions").val());
                                                $(".adj-price").html(dd1);
                                                $("#Conclusions").val($("#Conclusions1").html());
                                            }

                                        });
                                    }
                                }
                            });



                        });
                    });
                }

                if ((index + 1) == 1) {
                    $("#MarketPerAdjustmentPrice1,#TotalAdjustments1").change(function () {
                        report.bindfn1();
                    });
                } else {
                    $("#MarketPerAdjustmentPrice2,#TotalAdjustments2").change(function () {
                        report.bindfn2();
                    });
                }
            });

            var dataH = {
                'MLS': dd.MLS,
                'Id': 0
            };

            //general.doAjax('/home/listingHistory', dataH, function (d) {
            //    if (d.CountHome == 0) {
            //        $(".history-text-c" + (index + 2)).html("This property has never been listed since the year 2003.");
            //    } else {
            //        $(".history-text-c" + (index + 2)).html("The property was listed " + d.CountHome + " times since the year " + d.YearSince + ".");
            //    }
            //});

            general.doAjax('/home/getListingHistory', dataH, function (d) {
                var html = "";

                $.each(d, function (index, value) {
                    html += '<small>' + value.LastSoldDate + '</small><li>' + value.LastStatus + '<span>' + value.LastSoldPrice + '</span></li>';
                });


                $(".listing-history-data-li-c" + (index + 2)).html(html);
            });


            $(".see-history").click(function () {
                $("#listingHistoryModal-c" + $(this).attr("index")).modal();
            });

        },
        bindMarker = function (data, index, registeredUser) {
            console.log(index);
            var image = "/content/img/sale.png";
            if (index == 1) {
                image = "/content/img/icon-a.png";
                map.setCenter(new google.maps.LatLng(data.Lat, data.Lng));
            }
            else if (index == 2) {
                image = "/content/img/icon-b.png";
            }
            else if (index == 3) {
                image = "/content/img/icon-c.png";
            }
            else if (index == 4) {
                image = "/content/img/icon-d.png";
            }
            else if (index == 5) {
                image = "/content/img/icon-e.png";
            }
            else if (index == 6) {
                image = "/content/img/icon-f.png";
            }
            else if (index == 7) {
                image = "/content/img/icon-g.png";
            }
            else if (index == 8) {
                image = "/content/img/icon-h.png";
            }
            else if (index == 9) {
                image = "/content/img/icon-i.png";
            }
            else if (index == 10) {
                image = "/content/img/icon-j.png";
            }
            else if (index == 11) {
                image = "/content/img/icon-k.png";
            }

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(data.Lat, data.Lng),
                map: map,
                title: data.Address,
                icon: image
            });

            markers.push(marker);

            addInfoWindow(marker, data, image, registeredUser, (index - 1));
        },
        addInfoWindow = function (marker, data, image, registeredUser, index) {
            currentData.push(data);
            var content = '<div class="map-housecontent" style="position: relative;top: auto;right: auto;width: 100%;">';
            content = content + getHtml(data, image, index, registeredUser, true);
            content = content + "</div>";

            if ($("#reportPage").length == 1 || $("#map-data-view").length > 0) {
                var mls = $("#mls-id-new").val();
                if (mls != data.MLS) {
                    var reportContent = '<div class="col-lg-4 col-md-6"><div class="map-housecontent" style="margin-top: 15px;">';
                    reportContent = reportContent + getHtml(data, image, index, registeredUser, false);
                    reportContent = reportContent + "</div></div>";

                    if (index == 0) {
                        $("#map-data-view").prepend(reportContent);
                    } else {
                        $("#map-data-view").append(reportContent);
                    }

                    $('.slider-map-' + (index + 1)).bxSlider();

                }
            }

            var qpWindow = new google.maps.InfoWindow({ content: content });
            qpWindows.push(qpWindow);
            google.maps.event.addListener(marker, 'mouseover', function (event) {
                currentMarker = marker;
                $.each(qpWindows, function (index, value) {
                    value.close();
                });

                qpWindow.open(map, marker);
            });
            google.maps.event.addListener(marker, 'click', function (event) {
                currentMarker = marker;
                $.each(qpWindows, function (index, value) {
                    value.close();
                });

                qpWindow.open(map, marker);
            });

            //google.maps.event.addListener(marker, 'mouseout', function () {
            //    qpWindow.close();
            //});

            map.addListener('click', function (e) {
                qpWindow.close();
            });

            google.maps.event.addListener(qpWindow, 'domready', function () {

                // Reference to the DIV that wraps the bottom of infowindow
                var iwOuter = $('.gm-style-iw');
                iwOuter.css({ 'padding': '0', 'border-radius': '0', 'width': '400px' });



                /* Since this div is in a position prior to .gm-div style-iw.
                 * We use jQuery and create a iwBackground variable,
                 * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
                */
                var iwBackground = iwOuter.prev();

                //iwOuter.fadeIn(500);
                //iwOuter.children(':nth-child(1)').css({ 'box-shadow': '-1px -4px 2px 2px rgba(0,0,0,0.3)' });

                // Removes background shadow DIV
                //iwBackground.children(':nth-child(2)').css({ 'display': 'none' });

                // Removes white background DIV
                //iwBackground.children(':nth-child(4)').css({ 'display': 'none' });

                // Moves the infowindow 115px to the right.


                // Moves the shadow of the arrow 76px to the left margin.
                //iwBackground.children(':nth-child(1)').attr('style', function (i, s) { return s + 'left: 76px !important;display: none !important' });

                // Moves the arrow 76px to the left margin.

                // Changes the desired tail shadow color.
                //iwBackground.children(':nth-child(3)').find('div').children().css({ 'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index': '1' });

                // Reference to the div that groups the close button elements.
                //var iwCloseBtn = iwOuter.next();

                //// Apply the desired effect to the close button
                //iwCloseBtn.css({ opacity: '1', right: '-90%', top: '10px', background: 'url(/images/close-map.png)', width: '26px', height: '26px', 'background-repeat': 'no-repeat', 'position': 'relative' });
                //iwCloseBtn.addClass('close-btn');
                //iwCloseBtn.next().addClass('close-btn-img');
                //iwCloseBtn.find('img').css('display', 'none');

                // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
                //if ($('.iw-content').height() < 140) {
                //    $('.iw-bottom-gradient').css({ display: 'none' });
                //}

                //iwCloseBtn.mouseout(function () {
                //    $(this).css({ opacity: '1' });
                //});
            });
        },
        getHtml = function (data, image, index, registeredUser, forMap) {
            console.log(data);
            var content = '<div class="map-house">';
            content += '<div class="mail-img-box">';
            if (registeredUser) {

                if (forMap) {
                    content += '<a target="_blank" href="/details?MLS=' + data.MLS + '&id=' + $("#id").val() + '"> <img onerror="homeEstimate.changeImage(this)" src="' + data.Image + '" alt="" style="height: 200px;object-fit:cover;">';
                } else {
                    content += "<div class='slider-map-" + (index + 1) + "'>";

                    for (var i = 1; i < 12; i++) {
                        content += "<div class='custom-img'><img onerror='$(this).parents('.custom-img').remove();' src='https://homeoptimaimages.s3.amazonaws.com/Photo" + data.MLSID + "-" + i + "' alt='gr' /></div>";
                    }

                    content += "</div>";
                }
            } else {
                content += '<img src="/content/img/placeholder-image.png" alt="" style="height: 200px;object-fit:cover;">';
            }

            content += '<img class="top-icon" src="' + image + '" alt="">';

            if (registeredUser) {
                content += '</a>';
            }

            if (forMap == true) {
                content += '<i class="fa fa-arrow-left" onclick="homeEstimate.prevMap(' + index + ', this)" style="font-size: 25px;position: absolute;left: 0;top: 50%;cursor: pointer;"></i>';
                content += '<i class="fa fa-arrow-right" onclick="homeEstimate.nextMap(' + index + ', this)" style="font-size: 25px;position: absolute;right: 0;top: 50%;cursor: pointer;"></i>';
            }

            content += '</div>';
            content += '</div>';
            content += '<div class="map-content">';
            content += '<div class="box-map">';
            content += '<div class="row">';
            content += ' <div class="col-5">';
            content += '<div class="content-map-now">';
            if (registeredUser) {
                content += '<h4>' + data.ListPriceStr + '</h4>';
            } else {
                content += '<h4>xxxx</h4>';
            }
            if(data.SoldPrice != "" && data.SoldPrice != "$"){
                content += '<h5>Sold</h5>';
            }else{
                content += '<h5>Active</h5>';
            }

            
            content += '</div>';
            content += '</div>';
            content += '<div class="col-7">';
            content += '<div class="content-map-now contant-right">';
            if (registeredUser) {
                if(data.SoldPrice != "" && data.SoldPrice != "$"){
                    content += '<h4>' + data.SoldPrice + '</h4>';
                }

                if(data.SoldDate != ""){
                    content += '<p>Sold on ' + data.SoldDate + '</p>';
                }                
                
            } else {
                content += '<h4>xxxx</h4>';
                content += '<p>Sold on xxx, xx xxxx</p>';
            }
            content += ' </div>';
            content += '</div>';
            content += '</div>'; // row
            content += '</div>'; // box-map
            if (registeredUser) {
                var add = data.Address.split(',');

                content += '<div class="text-mapcustom text-center">';
                if ($("#reportPage").length == 1 || $("#map-data-view").length > 0) {
                    content += '<p><input type="checkbox" class="checkbox" mls-id="' + data.MLS + '" /> ' + (add.length > 0 ? add[0] : data.Address) + '</p>';
                } else {
                    content += '<p>' + (add.length > 0 ? add[0] : data.Address) + '</p>';
                }

                content += '<div class="beds-content-now">';
                content += '<div class="row">';

                content += '<div class="col-4">';
                content += '<div class="text-detached">';
                content += '<p><strong>' + data.Bedrooms + '</strong> beds</p>';
                content += '<p><strong>' + data.Washrooms + '</strong> baths</p>';
                content += '</div>';
                content += '</div>';

                content += '<div class="col-8">';
                content += '<div class="text-detached text-right">';
                content += '<p>' + data.Type + '</p>';
                content += '<p><strong>' + data.DaysOnMarket + ' Days</strong> On Market</p>';
                content += '</div>';
                content += '</div>';

                content += '</div>'; //row
                content += '</div>'; //beds-content-now
                content += '</div>'; //text-mapcustom
            } else {
                content += '<div class="text-mapcustom text-center">';
                content += '<div class="premium-now-map"><a href="javascript:void(0);" class="btn btn-long register-btn-map" onclick="general.bindRegisterNew()">Go premium now</a></div>';
                content += '</div>'; //text-mapcustom
            }

            content += '</div>';

            return content;
        },
        nextMap = function (index, id) {
            var UserId = $("#UserId").val();
            var registeredUser = false;
            if (UserId != undefined && UserId != null && UserId != "") {
                registeredUser = true;
            }

            if (registeredUser && currentData.length > (index + 1)) {
                changeHome(currentData[index + 1], index + 1, id, registeredUser);
            }
        },
        prevMap = function (index, id) {
            var UserId = $("#UserId").val();
            var registeredUser = false;
            if (UserId != undefined && UserId != null && UserId != "") {
                registeredUser = true;
            }

            if (registeredUser && index > 0) {
                console.log(currentData);
                changeHome(currentData[index - 1], index - 1, id, registeredUser);
            }

        },
        changeHome = function (data, index, id, registeredUser) {
            var image = "/content/img/sale.png";
            if (index == 0) {
                image = "/content/img/icon-a.png";
            }
            else if (index == 1) {
                image = "/content/img/icon-b.png";
            }
            else if (index == 2) {
                image = "/content/img/icon-c.png";
            }
            else if (index == 3) {
                image = "/content/img/icon-d.png";
            }
            else if (index == 4) {
                image = "/content/img/icon-e.png";
            }
            else if (index == 5) {
                image = "/content/img/icon-f.png";
            }
            else if (index == 6) {
                image = "/content/img/icon-g.png";
            }
            else if (index == 7) {
                image = "/content/img/icon-h.png";
            }
            else if (index == 8) {
                image = "/content/img/icon-i.png";
            }
            else if (index == 9) {
                image = "/content/img/icon-j.png";
            }
            else if (index == 10) {
                image = "/content/img/icon-k.png";
            }

            var html = getHtml(data, image, index, registeredUser, true);
            $(id).closest('.map-housecontent').html(html);

        },
        changeImage = function (id) {
            $(id).attr("src", "/content/img/placeholder-image.png");
        },
        clickShare = function () {
            var data = {
                'id': $("#id").val()
            };

            general.doAjax('/home/UpdateClickShare', data, function (d) {

            });
        },
        bindChartCommunity = function (dataGraph1, dataGraph2, community) {


            CanvasJS.addColorSet("customColorSet1",
                [
                    "white"
                ]);

            var arr = [];
            $.each(dataGraph1, function (index, value) {
                arr.push({ y: parseInt(value.Level2), label: value.Level1.substring(0, 3) })
            });

            var chart = new CanvasJS.Chart("community-sold", {
                // title:{
                //     text: "Detached house sold - " + community,
                //     fontColor: "white",
                // },
                animationEnabled: true,
                backgroundColor: "rgba(0, 0, 0, 0)",
                colorSet: "customColorSet1",
                theme: "light2", // "light1", "light2", "dark1", "dark2"
                axisX: {
                    lineColor: "white",
                    tickColor: "#4f77cc",
                    gridColor: "white",
                    labelFontColor: "white",
                },
                axisY: {
                    lineColor: "rgba(0, 0, 0, 0)",
                    tickColor: "rgba(0, 0, 0, 0)",
                    gridColor: "white",
                    labelFontColor: "white",

                },
                data: [{
                    indexLabel: "{y}",
                    indexLabelFontColor: "white",
                    indexLabelPlacement: "outside",
                    indexLabelOrientation: "horizontal",
                    type: "column",
                    dataPoints: arr
                }]
            });
            chart.render();

            arr = [];
            $.each(dataGraph2, function (index, value) {
                arr.push({ y: parseInt(value.Level2), label: value.Level1.substring(0, 3) })
            });

            var chart1 = new CanvasJS.Chart("community-sold-asking", {
                // title:{
                //     text: "Detached house sold - " + community,
                //     fontColor: "white",
                // },
                animationEnabled: true,
                backgroundColor: "rgba(0, 0, 0, 0)",
                colorSet: "customColorSet1",
                theme: "light2", // "light1", "light2", "dark1", "dark2"
                axisX: {
                    lineColor: "white",
                    tickColor: "#4f77cc",
                    gridColor: "white",
                    labelFontColor: "white",
                },
                axisY: {
                    lineColor: "rgba(0, 0, 0, 0)",
                    tickColor: "rgba(0, 0, 0, 0)",
                    gridColor: "white",
                    labelFontColor: "white",
                    minimum: 90,
                    maximum: 110,

                },
                data: [{
                    indexLabel: "{y}",
                    indexLabelFontColor: "white",
                    indexLabelPlacement: "outside",
                    indexLabelOrientation: "horizontal",
                    type: "column",
                    dataPoints: arr
                }]
            });
            chart1.render();
        },
        bindChartCommunity1 = function (dataGraph3, dataGraph4, community) {


            CanvasJS.addColorSet("customColorSet1",
                [
                    "white"
                ]);
            var arr = [];
            var arr1 = [];
            $.each(dataGraph3, function (index, value) {
                arr.push({ y: parseInt(value.Level2), label: value.Level1 })
            });
            $.each(dataGraph4, function (index, value) {
                arr1.push({ y: parseInt(value.Level2), label: value.Level1 })
            });

            var chart2 = new CanvasJS.Chart("community-days-on-market", {
                // title:{
                //     text: "Detached house sold - " + community,
                //     fontColor: "white",
                // },
                animationEnabled: true,
                backgroundColor: "rgba(0, 0, 0, 0)",
                colorSet: "customColorSet1",
                theme: "light2", // "light1", "light2", "dark1", "dark2"
                axisX: {
                    lineColor: "white",
                    tickColor: "#4f77cc",
                    gridColor: "white",
                    labelFontColor: "white",
                },
                axisY: {
                    lineColor: "rgba(0, 0, 0, 0)",
                    tickColor: "rgba(0, 0, 0, 0)",
                    gridColor: "white",
                    labelFontColor: "white",

                },
                data: [{
                    indexLabel: "{y}",
                    indexLabelFontColor: "white",
                    indexLabelPlacement: "outside",
                    indexLabelOrientation: "horizontal",
                    type: "bar",
                    dataPoints: arr
                }]
            });
            chart2.render();

            CanvasJS.addColorSet("customColorSet2",
                [
                    "white",
                    "#c2cfec"
                ]);

            //$("#community-offer-strategy---1").append(JSON.stringify(arr1));

            var chart3 = new CanvasJS.Chart("community-offer-strategy", {
                animationEnabled: true,
                backgroundColor: "#466fc7",
                colorSet: "customColorSet2",
                axisX: {
                    lineColor: "white",
                    tickColor: "#4f77cc",
                    gridColor: "white",
                    labelFontColor: "white",
                },
                axisY: {
                    lineColor: "rgba(0, 0, 0, 0)",
                    tickColor: "rgba(0, 0, 0, 0)",
                    gridColor: "white",
                    labelFontColor: "white",

                },
                data: [{
                    type: "pie",
                    indexLabel: "{y}",
                    indexLabelFontColor: "black",
                    indexLabelPlacement: "inside",
                    indexLabelOrientation: "horizontal",
                    startAngle: 240,
                    yValueFormatString: "##0.0\"%\"",
                    fontColor: "white",
                    dataPoints: arr1
                }]
            });
            chart3.render();
        },
        bindChartCommunity2 = function (dataGraph3, dataGraph4, community) {


            CanvasJS.addColorSet("customColorSet1",
                [
                    "white"
                ]);
            var arr = [];
            var arr1 = [];
            $.each(dataGraph3, function (index, value) {
                arr.push({ y: parseInt(value.Level2), label: value.Level1 })
            });
            $.each(dataGraph4, function (index, value) {
                arr1.push({ y: parseInt(value.Level2), label: value.Level1 })
            });

            var chart2 = new CanvasJS.Chart("community-days-on-market-1", {
                // title:{
                //     text: "Detached house sold - " + community,
                //     fontColor: "white",
                // },
                animationEnabled: true,
                backgroundColor: "rgba(0, 0, 0, 0)",
                colorSet: "customColorSet1",
                theme: "light2", // "light1", "light2", "dark1", "dark2"
                axisX: {
                    lineColor: "white",
                    tickColor: "#4f77cc",
                    gridColor: "white",
                    labelFontColor: "white",
                },
                axisY: {
                    lineColor: "rgba(0, 0, 0, 0)",
                    tickColor: "rgba(0, 0, 0, 0)",
                    gridColor: "white",
                    labelFontColor: "white",

                },
                data: [{
                    indexLabel: "{y}",
                    indexLabelFontColor: "white",
                    indexLabelPlacement: "outside",
                    indexLabelOrientation: "horizontal",
                    type: "bar",
                    dataPoints: arr
                }]
            });
            chart2.render();

            CanvasJS.addColorSet("customColorSet2",
                [
                    "white",
                    "#c2cfec"
                ]);

            var chart3 = new CanvasJS.Chart("community-offer-strategy-1", {
                animationEnabled: true,
                backgroundColor: "#466fc7",
                colorSet: "customColorSet2",
                axisX: {
                    lineColor: "white",
                    tickColor: "#4f77cc",
                    gridColor: "white",
                    labelFontColor: "white",
                },
                axisY: {
                    lineColor: "rgba(0, 0, 0, 0)",
                    tickColor: "rgba(0, 0, 0, 0)",
                    gridColor: "white",
                    labelFontColor: "white",

                },
                data: [{
                    type: "pie",
                    indexLabel: "{y}",
                    indexLabelFontColor: "black",
                    indexLabelPlacement: "inside",
                    indexLabelOrientation: "horizontal",
                    startAngle: 240,
                    yValueFormatString: "##0.0\"%\"",
                    fontColor: "white",
                    dataPoints: arr1
                }]
            });
            chart3.render();
        }
    return {
        init: init,
        saveUserOption: saveUserOption,
        changeImage: changeImage,
        nextMap: nextMap,
        prevMap: prevMap,
        clickShare: clickShare,
        bindChart: bindChart,
        bindChartPdf: bindChartPdf,
        bindChartPdfNew: bindChartPdfNew,
        bindMap: bindMap,
        bindChartCity: bindChartCity,
        bindHistoryButton: bindHistoryButton,
        bindC2AndC3: bindC2AndC3,
        bindChartCommunity: bindChartCommunity,
        bindChartCommunity1: bindChartCommunity1,
        bindChartCommunity2: bindChartCommunity2,
        getMapHomes: getMapHomes,
        bindMapDataReportSaved: bindMapDataReportSaved,
        initNew: initNew,
        back: back,
        bindChartPdfLevels: bindChartPdfLevels
    };
}();