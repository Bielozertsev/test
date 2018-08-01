$(document).ready(function () {

    //Globals
    var MessagesVisibleCount = 5,
        MessagesMoreCount = 5,
        offsetCount = 0,
        userEmail = 'test123@gmail.com',
        userId = 1;

    var repliedMessageTemplate = (function (msgInfo, parentMsgInfo) {

        var myDate = new Date(msgInfo.created_at),
            postCreatedTime = myDate.getHours() + ':' + myDate.getMinutes(),
            postCreatedDate = (myDate.getDate() < 10 ? '0' : '') + myDate.getDate() + '-' + ((myDate.getMonth() + 1) < 10 ? '0' : '') + (myDate.getMonth() + 1) + '-' + myDate.getFullYear();

        var showHide = msgInfo.author.id !== userId ? "hidden" : "";


        var repliedMsgHtml =
            '               <div class="comments-wrap js-commentsWrap" data-id="' + msgInfo.id + '">' +
            '                   <div class="comments-wrap-inner js-commentsWrapInner">' +
            '             <div class="comments-avatar">' +
            '                   <div class="comments-avatar-inner" style="background-image: url(' + msgInfo.author.avatar + ')">' +
            '                   </div>' +
            '               </div>' +
            '                       <div class="comments-content-item">' +
            '                   <author class="comments-content-author">' + msgInfo.author.name + '</author>' +
            '                           <span class="comments-content-parent">' + parentMsgInfo + '</span>   ' +
            '                   <time class="comments-content-date">' +
            '                       <span class="comments-content-date-val">' + postCreatedDate + '</span> ' +
            '                       <span class="comments-content-date-devider">at</span> ' +
            '                       <span class="comments-content-time-val">' + postCreatedTime + '</span> ' +
            '                   </time>' +
            '                   <div class="comments-content-text js-commentsContentText">' + msgInfo.content + '</div>' +
            '                   <ul class="comments-content-actions-list">' +
            '                       <li class="comments-content-actions-item comments-content-actions-edit ' + showHide + '">' +
            '                           <button class="js-edit">Edit</button>' +
            '                       </li>' +
            '                       <li class="comments-content-actions-item comments-content-actions-delete ' + showHide + '">' +
            '                           <button class="js-delete">Delete</button>' +
            '                       </li>' +
            '                   </ul>' +
            '               <form class="comments-form js-commentsForm">' +
            '                   <div class="comments-form-item">' +
            '                       <textarea class="comments-textarea js-textarea"  placeholder="Your Message">' +
            '                       </textarea>' +
            '                   </div>' +
            '                   <div class="comments-form-item">' +
            '                       <input class="comments-submit btn js-submit" type="submit" value="Send">' +
            '                   </div>' +
            '               </form>' +
            '               </div>' +
            '                   </div>' +
            '               </div>';
        return repliedMsgHtml;
    });


    var messageTemplate = (function (msgInfo, repliedItems) {

        var myDate = new Date(msgInfo.created_at),
            postCreatedTime = myDate.getHours() + ':' + myDate.getMinutes(),
            postCreatedDate = (myDate.getDate() < 10 ? '0' : '') + myDate.getDate() + '-' + ((myDate.getMonth() + 1) < 10 ? '0' : '') + (myDate.getMonth() + 1) + '-' + myDate.getFullYear();

        var showHide = msgInfo.author.id !== userId ? "hidden" : "";

        var repliedItemsContent = repliedItems ? repliedItems : "";


        var msgHtml = '<div class="comments-wrap js-commentsWrap js-commentsWrapParent" data-id="' + msgInfo.id + '">' +
            '           <div class="comments-wrap-inner js-commentsWrapInner">' +
            '               <div class="comments-avatar">' +
            '                   <div class="comments-avatar-inner" style="background-image: url(' + msgInfo.author.avatar + ')">' +
            '                   </div>' +
            '               </div>' +
            '               <div class="comments-content-item">' +
            '                   <author class="comments-content-author js-commentsContentAuthor">' + msgInfo.author.name + '</author>' +
            '                   <time class="comments-content-date">' +
            '                       <span class="comments-content-date-val">' + postCreatedDate + '</span> ' +
            '                       <span class="comments-content-date-devider">at</span> ' +
            '                       <span class="comments-content-time-val">' + postCreatedTime + '</span> ' +
            '                   </time>' +
            '                   <div class="comments-content-text js-commentsContentText">' + msgInfo.content + '</div>' +
            '                   <ul class="comments-content-actions-list">' +
            '                       <li class="comments-content-actions-item comments-content-actions-edit ' + showHide + '">' +
            '                           <button class="js-edit">Edit</button>' +
            '                       </li>' +
            '                       <li class="comments-content-actions-item comments-content-actions-delete ' + showHide + '">' +
            '                           <button class="js-delete">Delete</button>' +
            '                       </li>' +
            '                       <li class="comments-content-actions-item comments-content-actions-reply">' +
            '                           <button class="js-reply">Reply</button>' +
            '                       </li>' +
            '                   </ul>' +
            '               <form class="comments-form js-commentsForm">' +
            '                   <div class="comments-reply-items clearfix">' +
            '                       <span class="comments-reply-author js-commentsReplyAuthor"></span>   ' +
            '                       <button class="comments-reply-close js-commentsReplyClose">Cancel</button> ' +
            '                   </div> ' +
            '                   <div class="comments-form-item">' +
            '                       <textarea class="comments-textarea js-textarea" placeholder="Your Message">' +
            '                       </textarea>' +
            '                   </div>' +
            '                   <div class="comments-form-item">' +
            '                       <input class="comments-submit btn js-submit" type="submit" value="Send">' +
            '                   </div>' +
            '               </form>' +
            '               </div>' +
            '               <div class="comments-replied-list js-repliedList">' + repliedItemsContent +
            '               </div>' +
            '             </div>';
        return msgHtml;
    });


//get messages list
    var getMessagesList = (function (offsetCount) {
        $.ajax({
            url: 'http://frontend-test.pingbull.com/pages/' + userEmail + '/comments',
            type: 'POST',
            dateType: 'json',
            data: {
                _method: 'GET',
                count: MessagesVisibleCount,
                offset: offsetCount
            },
            success: function (result) {
                //show msg list
                $.each(result, function (index, msgInfo) {

                    var repliedItems = [];
                    for (i = 0; i < msgInfo.children.length; i++) {
                        repliedItems.push(repliedMessageTemplate(msgInfo.children[i], msgInfo.author.name))
                    }

                    var appendingFunc = function () {
                        $('.js-commentsList').append(messageTemplate(
                            msgInfo,
                            repliedItems.join("")
                        ));
                    }
                    appendingFunc();

                    //add userInfo
                    if (msgInfo.author.id == userId) {
                        $('.js-userAvatar').css('background-image', 'url("' + msgInfo.author.avatar + '")');
                    }
                })
            }
        });
    });
    getMessagesList(offsetCount);


//edit comment
    $(document).on('click', '.js-edit', function () {
        var closestWrap = $(this).closest('.js-commentsWrap'),
            text = closestWrap.find('.js-commentsContentText').eq(0).text();
        closestWrap.find('.js-textarea').eq(0).val(text)
        closestWrap.find('.js-commentsForm').eq(0).show().addClass('editing').removeClass('newMessage');
        closestWrap.find('.js-commentsReplyAuthor').hide();
    });

    $(document).on('click', '.editing .js-submit', function (event) {
        event.preventDefault();
        var closestWrap = $(this).closest('.js-commentsWrap'),
            newCommentText = closestWrap.find('.js-textarea').eq(0).val(),
            commentID = closestWrap.data('id');


        if (closestWrap.find('.js-commentsForm.editing')) {
            $.ajax({
                url: 'http://frontend-test.pingbull.com/pages/' + userEmail + '/comments/' + commentID + '',
                type: 'POST',
                dateType: 'json',
                data: {
                    _method: 'PUT',
                    content: newCommentText
                },
                success: function () {
                    closestWrap.find('.js-commentsContentText').eq(0).text(newCommentText);
                    closestWrap.find('.js-commentsForm').eq(0).hide().toggleClass('editing');
                }
            });
        }
    });


//new comment
    $(document).on('click', '.js-reply', function () {
        var closestWrap = $(this).closest('.js-commentsWrap');
        var closestAuthor = closestWrap.find('.js-commentsContentAuthor').text();
        closestWrap.find('.js-commentsForm').eq(0).show().addClass('newMessage').removeClass('editing');
        closestWrap.find('.js-commentsReplyAuthor').show().text(closestAuthor);
        closestWrap.find('.js-textarea').val('');
    });

    $(document).on('click', '.newMessage .js-submit', function (event) {
        event.preventDefault();
        var closestWrap = $(this).closest('.js-commentsWrap'),
            messageText = closestWrap.find('.js-textarea').eq(0),
            parentId = closestWrap.data('id') ? closestWrap.data('id') : '',
            parentList = $(this).closest('.js-commentsWrapParent').find('.js-repliedList'),
            repliedToAuthor = closestWrap.find('.js-commentsContentAuthor').text();

        $.ajax({
            url: 'http://frontend-test.pingbull.com/pages/' + userEmail + '/comments',
            type: 'POST',
            dateType: 'json',
            data: {
                _method: 'POST',
                content: messageText.val(),
                parent: parentId
            },
            success: function (result) {
                if (parentId) {
                    parentList.append(repliedMessageTemplate(result, repliedToAuthor));
                }
                else {
                    $('.js-commentsList').prepend(messageTemplate(result));
                }
                messageText.val('');
                closestWrap.not('.js-commentsWrapDefault').find('.js-commentsForm').eq(0).hide();
            }
        });
    });


//load more comments
    $(document).on('click', '.js-commentsLoadBtn', function () {
        offsetCount += MessagesMoreCount
        getMessagesList(offsetCount);
    });


//delete comments
    $(document).on('click', '.js-delete', function () {

        var closestWrap = $(this).closest('.js-commentsWrap'),
            commentID = closestWrap.data('id');

        $.ajax({
            url: 'http://frontend-test.pingbull.com/pages/' + userEmail + '/comments/' + commentID + '',
            type: 'POST',
            dateType: 'json',
            data: {
                _method: 'DELETE'
            },
            success: function () {
                closestWrap.remove();
            }
        });
    });

//close form
    $(document).on('click', '.js-commentsReplyClose', function (event) {
        event.preventDefault();
        $(this).closest('.js-commentsForm').hide();
    });
});


