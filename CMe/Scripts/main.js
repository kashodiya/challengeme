$(function () {
    var $toggleBannerBtn = $('#toggleBannerBtn');
    var $bigBannerTitle = $('#bigBannerTitle');
    var $bigBannerButtons = $('#bigBannerButtons');
    var $myScore = $('#myScore');
    var $bigBanner = $('#bigBanner');
    var $myProfilePanel = $('#myProfilePanel');
    var $myChallengePanel = $('#myChallengePanel');
    var $allFightersList = $("#allFightersList");
    var $allChallengesList = $("#allChallengesList");
    var $myChallengesList = $("#myChallengesList");
    var $myAssignmentsList = $("#myAssignmentsList");
    //var $myChallengesTabView = $('#myChallengesTabView');
    var $fightersTabViewTab = $('#fightersTabViewTab');
    var $allChallengesTabViewTab = $('#allChallengesTabViewTab');
    var $myChallengesTabViewTab = $('#myChallengesTabViewTab');
    var $myAssignmentsTabViewTab = $('#myAssignmentsTabViewTab');
    var $assignedFightersTableBody = $('#assignedFightersTableBody');
    var $availableFightersTableBody = $('#availableFightersTableBody');
    var $fightersListFilterToggleBtn = $('#fightersListFilterToggleBtn');
    var $challengesListFilterToggleBtn = $('#challengesListFilterToggleBtn');
    var $myChallengesListFilterToggleBtn = $('#myChallengesListFilterToggleBtn');
    var $myChallengeFormSubmitBtn = $('#myChallengeFormSubmitBtn');
    var $myProfileFormSubmitBtn = $('#myProfileFormSubmitBtn');
    var $myChallengeForm = $('#myChallengeForm');
    var $challengeAssignmentsBody = $('#challengeAssignmentsBody');

    var $myChallengeFormChallengeTitle = $('#myChallengeForm input[name="challengeTitle"]');
    var $myChallengeFormChallengeDescription = $('#myChallengeForm textarea[name="challengeDescription"]');
    var $myChallengeFormDeadlineDate = $('#myChallengeForm input[name="deadlineDate"]');
    var $myChallengeFormHoursNeeded = $('#myChallengeForm select[name="hoursNeeded"]');
    var $myChallengeFormChallengeKeywordsTxt = $('#myChallengeForm input[name="challengeKeywordsTxt"]');
    var $myChallengeFormEditMode = $('#myChallengeForm input[name="editMode"]');
    var $myChallengeFormStatus = $('#myChallengeForm select[name="status"]');
    var $myChallengeFormOid = $('#myChallengeForm input[name="oid"]');
    //var $myChallengeFormResetBtn = $('#myChallengeFormResetBtn');

    var $myProfileForm = $('#myProfileForm');
    var $myProfileFormProfileText = $('#myProfileForm textarea[name="profileText"]');
    var $myProfileFormKeywordsTxt = $('#myProfileForm input[name="keywordsTxt"]');
    var $myProfileFormHoursAvailable = $('#myProfileForm select[name="hoursAvailable"]');

    var $yesNoDialogTitle = $('#yesNoDialogTitle');
    var $yesNoDialogBody = $('#yesNoDialogBody');
    var $yesNoDialogYesBtn = $('#yesNoDialogYesBtn');
    var $yesNoDialogNoBtn = $('#yesNoDialogNoBtn');
    var yesNoDialogYesCallback, yesNoDialogNoCallback;
    var $createChallengePanel = $('#createChallengePanel');
    var $createChallengePanelHeader = $('#createChallengePanel .createChallengePanelHeader');
    var $fightersListFilterTools = $('#fightersListFilterTools');
    var $challengesListFilterTools = $('#challengesListFilterTools');
    var $myChallengesListFilterTools = $('#myChallengesListFilterTools');
    
    var $challengesListFilterByTitleLabel = $('#challengesListFilterByTitleLabel');
    var $yesNoDialog = $('#yesNoDialog');
    var $challengesListFilterByCreatorNameLabel = $('#challengesListFilterByCreatorNameLabel');
    var $challengesListFilterByKeywordsLabel = $('#challengesListFilterByKeywordsLabel');
    var challengesListFilterAndShortTemplate = Handlebars.compile($("#challengesListFilterAndShortTemplate").html());
    var allChallengesListTemplate = Handlebars.compile($("#allChallengesListTemplate").html());
    var allFightersListTemplate = Handlebars.compile($("#allFightersListTemplate").html());
    var myChallengesListTemplate = Handlebars.compile($("#myChallengesListTemplate").html());
    var myAssignmentsListTemplate = Handlebars.compile($("#myAssignmentsListTemplate").html());
    var availableFightersTableBodyTemplate = Handlebars.compile($("#availableFightersTableBodyTemplate").html());
    var availableFightersTableBodyRowTemplate = Handlebars.compile($("#availableFightersTableBodyRowTemplate").html());
    Handlebars.registerPartial("availableFightersTableBodyRowTemplate", $("#availableFightersTableBodyRowTemplate").html());
    var assignedFightersTableBodyTemplate = Handlebars.compile($("#assignedFightersTableBodyTemplate").html());
    //var assignedFightersListTemplate = Handlebars.compile($("#assignedFightersListTemplate").html());
    var challenges = [];
    var availableFighters = [];
    var myChallenges = [];
    var myAssignments = [];
    var $challengeRowJustDeletedRemoved;

    initPage();

    $myChallengeFormDeadlineDate.datepicker({
        format: 'mm/dd/yyyy'
    });

    $myChallengeFormChallengeKeywordsTxt.tagsManager({
        hiddenTagListName: 'keywords'
    });

    $myProfileFormKeywordsTxt.tagsManager({
        hiddenTagListName: 'keywords'
    });

    $yesNoDialogYesBtn.click(function(){
        yesNoDialogYesCallback.call();
    });

    $yesNoDialogNoBtn.click(function(){
        yesNoDialogNoCallback.call();
    });

    function yesNoDialogWidget(title, body, yesCallback, noCallback){
        $yesNoDialogTitle.text(title);
        $yesNoDialogBody.text(body);
        yesNoDialogYesCallback = yesCallback;
        yesNoDialogNoCallback = noCallback;
        $yesNoDialog.modal('show');
    }

    $toggleBannerBtn.click(function(){
        showHideBigBanner(true);
    });

    $fightersTabViewTab.on('shown', function (e) {
        Cookies.set('visbleTab', 'fightersTabViewTab');
    });

    $allChallengesTabViewTab.on('shown', function (e) {
        Cookies.set('visbleTab', 'allChallengesTabViewTab');
    });

    $myChallengesTabViewTab.on('shown', function (e) {
        Cookies.set('visbleTab', 'myChallengesTabViewTab');
    });

    $myAssignmentsTabViewTab.on('shown', function (e) {
        Cookies.set('visbleTab', 'myAssignmentsTabViewTab');
    });

    function setInitialViewState(){
        showHideBigBanner(false);
        var visbleTab = Cookies.get('visbleTab');
        switch (visbleTab) {
        case 'fightersTabViewTab':
            $fightersTabViewTab.tab('show');
            break;
        case 'myChallengesTabViewTab':
            $myChallengesTabViewTab.tab('show');
            break;
        case 'allChallengesTabViewTab':
            $allChallengesTabViewTab.tab('show');
            break;
        case 'myAssignmentsTabViewTab':
            $myAssignmentsTabViewTab.tab('show');
            break;
        }
    }



    function showHideBigBanner(toggle){
        var show = Cookies.get('bigBannerShow');
        if(!show){ 
            if($bigBannerTitle.is(":visible")){
                show = "true";
            }else{
                show = "false";
            }
        }
        if(toggle){
            if(show == "true"){
                show = 'false';
            }else{
                show = 'true';
            }
        }
        if(show == "false"){
            Cookies.set('bigBannerShow', 'false');
            $toggleBannerBtn.removeClass('icon-resize-small');
            $toggleBannerBtn.addClass('icon-resize-full');
            $bigBannerTitle.hide('slow');
            $bigBannerButtons.hide('slow');
            $myScore.hide('slow');
            $bigBanner.css('padding', '13px');
        }else{
            Cookies.set('bigBannerShow', 'true');
            $toggleBannerBtn.removeClass('icon-resize-full');
            $toggleBannerBtn.addClass('icon-resize-small');
            $bigBannerTitle.show();
            $bigBannerButtons.show();
            $myScore.show();
            $('#bigBanner').css('padding', '60px');
        }
    }

    
    $yesNoDialog.on('hidden', function(){
        console.log('yesNoDialog is hidden');
        if($challengeRowJustDeletedRemoved){
            $challengeRowJustDeletedRemoved.hide('slow', function(){ 
                $challengeRowJustDeletedRemoved.remove(); 
                $challengeRowJustDeletedRemoved = undefined;
            });
        }
    });

    $('.myChallengeDeleteBtn').live('click', function(){
        $this = $(this);
        var oid = $(this).data('id');
        yesNoDialogWidget(
            'Deleting the challenge', 
            'Are you sure you want to delete the challenge?', 
            function(){
                console.log('deleting iod = ' + oid);
                $.ajax({
                    url: '/Challenge/DeleteById?oid=' + oid,
                    dataType: 'json',
                    success: function (data) {
                        console.log('deleted success iod = ' + oid);
                        //var challenge = JSON.parse(data);
                        //console.log(data);
                        $challengeRowJustDeletedRemoved = $this.closest(".challengeRow");
                        //console.log($challengeRow);
                        $yesNoDialog.modal('hide');
                    }
                });
            },
            function(){
                console.log('no');
                $yesNoDialog.modal('hide');
            }
        );
    });

    $('.myChallengeEditBtn').live('click', function(){
        var oid = $(this).data('id');
        console.log(oid);
        $.ajax({
            url: '/Challenge/GetById?oid=' + oid,
            dataType: 'json',
            success: function (data) {
                var challenge = JSON.parse(data);
                //console.log(challenge);
                fillChallengeForm(challenge);
                $createChallengePanel.modal('show');
                //TODO: Keep assignment accordion closed for by defailt, open it when editing only
                //$challengeAssignmentsBody.collapse('show');
            }
        });
    });

    function clearChallengeForm(){
        //$myChallengeFormResetBtn.trigger('click');
        $myChallengeFormChallengeKeywordsTxt.tagsManager('empty');
        $availableFightersTableBody.empty();
        $assignedFightersTableBody.empty();


        $myChallengeFormEditMode.val('INSERT');
        $createChallengePanelHeader.text('Add a challenge');
        $myChallengeFormChallengeTitle.val('');
        $myChallengeFormOid.val('');

        $myChallengeFormChallengeDescription.val('');

        $myChallengeFormDeadlineDate.val(moment().format('MM/DD/YYYY'));
        $myChallengeFormDeadlineDate.datepicker('update');

        $myChallengeFormHoursNeeded.val('0');

        $myChallengeFormStatus.val('OPEN');

    }

    function fillChallengeForm(challenge){
        //console.log('editing challenge');
        //console.log(challenge);

        clearChallengeForm();

        $myChallengeFormEditMode.val('UPDATE');
        $createChallengePanelHeader.text('Edit the challenge');
        $myChallengeFormOid.val(challenge._id.$oid);

        $myChallengeFormChallengeTitle.val(challenge.challengeTitle);
        $myChallengeFormChallengeDescription.val(challenge.challengeDescription);
        var deadlineDate = moment(challenge.deadlineDate.$date).format("MM/DD/YYYY");

        $myChallengeFormDeadlineDate.val(deadlineDate);
        $myChallengeFormDeadlineDate.datepicker('update');

        $myChallengeFormHoursNeeded.val(challenge.hoursNeeded);


        //TODO: Remove previously existing tags
        $myChallengeFormChallengeKeywordsTxt.tagsManager({
            prefilled: challenge.keywords,
            hiddenTagListName: 'keywords'
        });

        $myChallengeFormStatus.val(challenge.status);
        fillAvailableFightersForChallengeForm(challenge.assignments);
    }

    function fillAvailableFightersForChallengeForm(challengeAssignments){
        $.ajax({
            url: '/Fighter/GetAvailableFighters',
            dataType: 'json',
            success: function (data) {
                var fighters = data;
                if(typeof(fighters) == 'string'){
                    fighters = JSON.parse(data);
                }
                availableFighters = fighters;

                $.each(challengeAssignments, function(index, assignment){
                    $.each(availableFighters, function(index1, fighter){
                        if(assignment.assignedToLoginId == fighter.loginId){
                            assignment.hoursAvailable = fighter.hoursAvailable;
                            assignment.loginId = fighter.loginId;
                            assignment.name = fighter.name;
                            availableFighters.splice(index1, 1);
                            //console.log(assignment.assignedToLoginId);
                            //console.log(fighter.name);
                            return false;
                        }                
                    });
                });

                $availableFightersTableBody.html(availableFightersTableBodyTemplate({ fighters: fighters }));
                $.each(challengeAssignments, function(index, assignment){
                    $assignedFightersTableBody.prepend(assignedFightersTableBodyTemplate(assignment));
                });
            }
        });
    }

    $('.editMyProfileBtn').click(function () {
        $myProfilePanel.toggle();
        $.ajax({
            url: '/Fighter/GetMyProfile',
            dataType: 'json',
            success: function (data) {
                var myProfile = JSON.parse(data);
                console.log(myProfile);
                fillMyProfileForm(myProfile);
            }
        });
    });

    function fillMyProfileForm(myProfile){
        $myProfileFormProfileText.val(myProfile.profileText);

        $myProfileFormKeywordsTxt.tagsManager('empty');
        $myProfileFormKeywordsTxt.tagsManager({
            prefilled: myProfile.keywords,
            hiddenTagListName: 'keywords'
        });

        $myProfileFormHoursAvailable.val(myProfile.hoursAvailable);
    }


    $('.createChallengeBtn').click(function (e) {
        //console.log('shown');
        clearChallengeForm();
        /*
        $myChallengeFormChallengeKeywordsTxt.tagsManager('empty');
        $myChallengeFormEditMode.val('INSERT');
        $myChallengeFormOid.val('');
        */
        fillAvailableFightersForChallengeForm([]);
        /*
        $.ajax({
            url: '/Fighter/GetAvailableFighters',
            dataType: 'json',
            success: function (data) {
                var fighters = data;
                if(typeof(fighters) == 'string'){
                    fighters = JSON.parse(data);
                }
                availableFighters = fighters;
                $availableFightersTableBody.html(availableFightersTableBodyTemplate({ fighters: fighters }));
            }
        });
        */
    });


    $('.removeFighterFromChallengeBtn').live('click', function() {
        var $this = $(this);
        $this.closest('tr').remove();
        var loginId = $this.data('loginid');
        var name = $this.data('name');
        var hoursAvailable = $this.data('hoursavailable');
        //console.log(loginId);
        $availableFightersTableBody.prepend(availableFightersTableBodyRowTemplate({name: name, loginId: loginId, hoursAvailable: hoursAvailable}));
        return false;
    });

    $('.assighFighterToChallengeBtn').live('click', function() {
        var $this = $(this);
        $this.closest('tr').remove();
        var loginId = $this.data('loginid');
        var name = $this.data('name');
        var hoursAvailable = $this.data('hoursavailable');
        //console.log(loginId);
        $assignedFightersTableBody.prepend(assignedFightersTableBodyTemplate({name: name, loginId: loginId, hoursAvailable: hoursAvailable}));
        return false;
    });

    $('#availableFightersList').multiselect({
        container: '<span class="dropdown" />',
    });


    $myProfileForm.submit(function (e) {
        $myProfileFormSubmitBtn.button('Saving...');
        e.preventDefault();
        var $thisForm = $(this);
        var postData = $thisForm.serialize();
        console.log($thisForm.attr('action'));
        console.log(postData);
        $.ajax({
            type: 'POST',
            url: $thisForm.attr('action'),
            data: postData,
            dataType: 'json',
            success: function (data) {
                $myProfileFormSubmitBtn.button('reset');
                console.log(data);
                $myProfilePanel.modal('hide');
                loadFighters();
                //$('#mainTab a[href="#fightersTabView"]').tab('show');
                $fightersTabViewTab.tab('show');
            }
        });
        return false;
    });


    //$myChallengeForm.submit(function (e) {
    $('#myChallengeForm').submit(function (e) {
        $myChallengeFormSubmitBtn.button('Saving...');
        e.preventDefault();
        var $thisForm = $(this);
        var postData = $thisForm.serialize();
        console.log($thisForm.attr('action'));
        console.log(postData);
        $.ajax({
            type: 'POST',
            url: $thisForm.attr('action'),
            data: postData,
            dataType: 'json',
            success: function (data) {
                $myChallengeFormSubmitBtn.button('reset');
                console.log(data);
                $createChallengePanel.modal('hide');
                loadMyChallenges();
                //$('#mainTab a[href="#myChallengesTabView"]').tab('show');
                $myChallengesTabViewTab.tab('show');
            }
        });
        return false;
    });
    
    /*
    */


    $("#fightersListFilterByName").change(function () {
        var filter = $(this).val().toUpperCase();
        if (filter) {
            $("#allFightersList .fighterRow:not([data-name*='" + filter + "'])").slideUp();
            $("#allFightersList .fighterRow[data-name*='" + filter + "']").slideDown();
        } else {
            $("#allFightersList .fighterRow").slideDown();
        }
    }).keyup(function () {
        $(this).change();
    });

    $("#fightersListFilterByKeywords").change(function () {
        var filter = $(this).val().toUpperCase();
        if (filter) {
            $("#allFightersList .fighterRow:not([data-keywords-txt*='" + filter + "'])").slideUp();
            $("#allFightersList .fighterRow[data-keywords-txt*='" + filter + "']").slideDown();
        } else {
            $("#allFightersList .fighterRow").slideDown();
        }
    }).keyup(function () {
        $(this).change();
    });

/*    
    $("#challengesListFilterByTitle").change(function () {
        var filter = $(this).val().toUpperCase();
        if (filter) {
            $("#allChallengesList").find(":not(.challengeTitle[data-uppercase-title*='" + filter + "'])").closest('.challengeRow').hide();
            $("#allChallengesList").find(".challengeTitle[data-uppercase-title*='" + filter + "']").closest('.challengeRow').show();
        } else {
            $("#allChallengesList").find(".challengeRow").slideDown();
        }
    }).keyup(function () {
        $(this).change();
    });
*/


    function renderFilterAndSortSection(){
        $('.challengesListFilterAndShort').each(function(i, ele){
            $ele = $(ele);
            $(ele).html(challengesListFilterAndShortTemplate({listId: $ele.data('for-list')}));
        });
        $('.challengesListFilterToggleBtn').click(function(){
            console.log('challengesListFilterToggleBtn');
            $this = $(this);
            console.log($this.data('for-list'));
            var forListId = $this.data('for-list');
            $('.challengesListFilterTools[data-for-list="'+ forListId +'"]').toggle();
        });
        $('.challengesListSortToggleBtn').click(function(){
            console.log('challengesListSortToggleBtn');
            $this = $(this);
            console.log($this.data('for-list'));
            var forListId = $this.data('for-list');
            $('.challengesListSortTools[data-for-list="'+ forListId +'"]').toggle();
        });

        $(".challengesListFilterByTitle").change(function () {
            $this = $(this);
            var forListId = $this.data('for-list');
            console.log(forListId + ' - challengesListFilterByTitle changed fired');
            var filter = $this.val().toUpperCase();
            if (filter) {
                $("#" + forListId +" .challengeRow:not([data-title*='" + filter + "'])").slideUp();
                $("#" + forListId +" .challengeRow[data-title*='" + filter + "']").slideDown();
            } else {
                $("#" + forListId +" .challengeRow").slideDown();
            }
        }).keyup(function () {
            $(this).change();
        });

        $(".challengesListFilterByCreatorName").change(function () {
            //setChallengeFilterLabelsActive(false, true, false);
            $this = $(this);
            var forListId = $this.data('for-list');
            var filter = $this.val().toUpperCase();
            if (filter) {
                $("#" + forListId +" .challengeRow:not([data-creator-name*='" + filter + "'])").slideUp();
                $("#" + forListId +" .challengeRow[data-creator-name*='" + filter + "']").slideDown();
            } else {
                $("#" + forListId +" .challengeRow").slideDown();
            }
        }).keyup(function () {
            $(this).change();
        });

        $(".challengesListFilterByKeywords").change(function () {
            $this = $(this);
            var forListId = $this.data('for-list');
            //setChallengeFilterLabelsActive(false, false, true);
            var filter = $this.val().toUpperCase();
            if (filter) {
                $("#" + forListId +" .challengeRow:not([data-keywords-txt*='" + filter + "'])").slideUp();
                $("#" + forListId +" .challengeRow[data-keywords-txt*='" + filter + "']").slideDown();
            } else {
                $("#" + forListId +" .challengeRow").slideDown();
            }
        }).keyup(function () {
            $(this).change();
        });
    }

/*
    $("#challengesListFilterByTitle").change(function () {
        setChallengeFilterLabelsActive(true, false, false);
        var filter = $(this).val().toUpperCase();
        if (filter) {
            $("#allChallengesList .challengeRow:not([data-title*='" + filter + "'])").hide();
            $("#allChallengesList .challengeRow[data-title*='" + filter + "']").show();
        } else {
            $("#allChallengesList .challengeRow").slideDown();
            //$("#allChallengesList").find(".challengeRow").slideDown();
        }
    }).keyup(function () {
        $(this).change();
    });

    $("#challengesListFilterByCreatorName").change(function () {
        setChallengeFilterLabelsActive(false, true, false);
        var filter = $(this).val().toUpperCase();
        if (filter) {
            $("#allChallengesList .challengeRow:not([data-creator-name*='" + filter + "'])").hide();
            $("#allChallengesList .challengeRow[data-creator-name*='" + filter + "']").show();
        } else {
            $("#allChallengesList").find(".challengeRow").slideDown();
        }
    }).keyup(function () {
        $(this).change();
    });

    $("#challengesListFilterByKeywords").change(function () {
        setChallengeFilterLabelsActive(false, false, true);
        var filter = $(this).val().toUpperCase();
        if (filter) {
            $("#allChallengesList .challengeRow:not([data-keywords-txt*='" + filter + "'])").hide();
            $("#allChallengesList .challengeRow[data-keywords-txt*='" + filter + "']").show();
        } else {
            $("#allChallengesList").find(".challengeRow").slideDown();
        }
    }).keyup(function () {
        $(this).change();
    });

    function setChallengeFilterLabelsActive(title, name, keyword){
        $challengesListFilterByTitleLabel.css('font-weight', 'normal');
        $challengesListFilterByCreatorNameLabel.css('font-weight', 'normal');
        $challengesListFilterByKeywordsLabel.css('font-weight', 'normal');
        if(title){
            $challengesListFilterByTitleLabel.css('font-weight', 'bold');
        }
        if(name){
            $challengesListFilterByCreatorNameLabel.css('font-weight', 'bold');
        }
        if(keyword){
            $challengesListFilterByKeywordsLabel.css('font-weight', 'bold');
        }
    }

*/

    /*
    $('#searchAvailableFighterInput').typeahead({
        source: function(query, process) {  
            var result = [];
            $.each(availableFighters, function(index, fighter){
                if(fighter.name.indexOf(query) >= 0){
                    result.push(fighter.name);
                }
            });
            console.log(result);
            process(result);
        }
    });

    $('#availableFightersPanelDoneBtn').click(function(){
        console.log('hide');
        $('#availableFightersPanel').modal('hide');
        var fighters = [{loginId: 'aaa', name: 'bbb'}];
        $('#assignedFightersList').html(assignedFightersListTemplate({ fighters: fighters }));
        console.log('hide1');
    });


    */


    //$("#createChallengePanel").modal();

    $('#myProfileForm').submit(function () {
        //TODO: Do AJAX post
        return false;
    });

    $myChallengesListFilterToggleBtn.click(function () {
        $myChallengesListFilterTools.toggle();
        if ($myChallengesListFilterTools.is(":visible")) {
            $myChallengesListFilterToggleBtn.text('Hide Filter Tools');
        } else {
            $myChallengesListFilterToggleBtn.text('Show Filter Tools');
        }
    });

    $challengesListFilterToggleBtn.click(function () {
        //console.log("aaa");
        $challengesListFilterTools.toggle();
        if ($challengesListFilterTools.is(":visible")) {
            $challengesListFilterToggleBtn.text('Hide Filter Tools');
        } else {
            $challengesListFilterToggleBtn.text('Show Filter Tools');
        }
    });


    $fightersListFilterToggleBtn.click(function () {
        $fightersListFilterTools.toggle();
        if ($fightersListFilterTools.is(":visible")) {
            $fightersListFilterToggleBtn.text('Hide Filter Tools');
        } else {
            $fightersListFilterToggleBtn.text('Show Filter Tools');
        }
    });

    /*
    function capitalizeKeywordsListData($recordRows){
        $recordRows.each(function (index, ele) {
            $(ele).attr('data-keywords-txt', $(ele).data('keywords-txt').toUpperCase());
        });
    }
    */

    function renderFighters() {
        $allFightersList.html(allFightersListTemplate({ fighters: fighters }));
        fixEmptyKeywordsList($allFightersList.find('.keywordsList'));
        //capitalizeKeywordsListData($('.fighterRow'));
    }

    function renderChallenges() {
        $allChallengesList.html(allChallengesListTemplate({ challenges: challenges }));
        fixEmptyKeywordsList($allChallengesList.find('.keywordsList'));
    }

    function renderMyChallenges() {
        $myChallengesList.html(myChallengesListTemplate({ myChallenges: myChallenges }));
        fixEmptyKeywordsList($myChallengesList.find('.keywordsList'));
    }

    function renderMyAssignments() {
        $myAssignmentsList.html(myAssignmentsListTemplate({ myAssignments: myAssignments }));
        fixEmptyKeywordsList($myAssignmentsList.find('.keywordsList'));
    }

    function loadChallenges() {
        $.ajax({
            url: '/Challenge/GetAll',
            dataType: 'json',
            success: function (data) {
                challenges = data;
                renderChallenges();
            }
        });
    }

    function loadMyChallenges() {
        $.ajax({
            url: '/Challenge/GetMyChallenges',
            dataType: 'json',
            success: function (data) {
                myChallenges = JSON.parse(data);
                //console.log(myChallenges);
                renderMyChallenges();
            }
        });
    }

    function loadMyAssignments() {
        $.ajax({
            url: '/Challenge/GetChallengesAssignedToMe',
            dataType: 'json',
            success: function (data) {
                myAssignments = JSON.parse(data);
                renderMyAssignments();
                //console.log(myAssignments);
            }
        });
    }


    function loadFighters() {
        $.ajax({
            url: '/Fighter/GetAll',
            dataType: 'json',
            success: function (data) {
                fighters = data;
                renderFighters();
            }
        });
    }

    function registerHandlebarsHelper() {
        Handlebars.registerHelper('dateFormat', function (date) {
            //console.log(moment(date).format('dddd, Do MMM, YYYY'));
            return moment(date).format('dddd, Do MMM, YYYY');
        });
    }


    function fixEmptyKeywordsList($keywordsList) {
        $keywordsList.each(function (index, ele) {
            if ($(ele).children().length == 0) {
                $(ele).html('<span class="label label-warning">No Keywords</span>');
            }
        });
    }



    function getAndReplacetUserName() {
        $.get('/Home/UserName', function (data) {
            //console.log(data);
            $('#userName').fadeOut(500, function () {
                $(this).text(data.fullName).fadeIn(500);
            });
            /*
            $("#userFullName").text(data.fullName);
            $("#userEmailAddress").text(data.emailAddress);
            $("#userEmployeeId").text(data.employeeId);
            $("#userGivenName").text(data.givenName);
            $("#userSurname").text(data.surname);
            $("#userDetailInfoBtn").removeClass("ui-disabled");
            */
        });
    }


    function initPage() {
        getAndReplacetUserName();
        setInitialViewState();
        registerHandlebarsHelper();
        loadFighters();
        loadChallenges();
        loadMyChallenges();
        loadMyAssignments();
        renderFilterAndSortSection();
    }

});

