/***** 送出指令 *****/
function send_switch_on(_socket, uuid) {
	_socket.send(JSON.stringify({
		func: "wb_switch",
		uuid: uuid,
		status: "on"
	}));
}
function send_switch_off(_socket, uuid) {
	_socket.send(JSON.stringify({
		func: "wb_switch",
		uuid: uuid,
		status: "off"
	}));
}
function send_switch_toggle(_socket, uuid) {
	_socket.send(JSON.stringify({
		func: "wb_toggle",
		uuid: uuid
	}));
}
function send_switch_status(_socket, uuid) {
	_socket.send(JSON.stringify({
		func: "wb_status",
		uuid: uuid
	}));
}
/***** 按鈕 *****/
function set_switch(_socket) {
	$("[class='m-checkbox']").bootstrapSwitch();
	$("[class='m-checkbox']").on('switchChange.bootstrapSwitch', function(event, state) {
		var uuid = $(this).parents(".li_data").attr("uuid");
		if(state) {
			send_switch_on(_socket, uuid);
		} else {
			send_switch_off(_socket, uuid);
		}
	});
}
function unset_switch() {
	$("[class='m-checkbox']").off('switchChange.bootstrapSwitch');
}
/***** 上線狀態 *****/
function set_offline(uuid) {
	var lidata = $(".li_data[uuid='" + uuid + "']");
	lidata.find(".online_status").css("color", "#ccc");
	lidata.find(".m-checkbox").bootstrapSwitch('disabled', true);
}
function set_online(uuid) {
	var lidata = $(".li_data[uuid='" + uuid + "']");
	lidata.find(".online_status").css("color", "#990");
	lidata.find(".m-checkbox").bootstrapSwitch('disabled', false);
}
/***** 開關狀態 *****/
function set_on(uuid) {
	var lidata = $(".li_data[uuid='" + uuid + "']");
	lidata.find(".m-checkbox").bootstrapSwitch('state', true, false);
}
function set_off(uuid) {
	var lidata = $(".li_data[uuid='" + uuid + "']");
	lidata.find(".m-checkbox").bootstrapSwitch('state', false, false);
}
function set_status(online_array) {
	$("li.li_data").each(function(i) {
		var uuid = $(this).attr("uuid");
		var uuid_did = $(this).attr("did");
		var uuid_skey = $(this).attr("skey");
		var uuid_online = false;
		var uuid_status = "off";
		$.each(online_array, function(index, data) {
			if(online_array[index].uuid == uuid) {
				uuid_online = true;
				if(online_array[index].status == "on"){
					uuid_status = "on";
				}
				return false;
			}
		});
		if(uuid_online) {
			set_online(uuid);
			if(uuid_status == "on") {
				set_on(uuid);
			} else {
				set_off(uuid);
			}
		} else {
			set_offline(uuid);
		}
	});
}
function start_websocket(_socket) {
	if (location.protocol != 'https:') {
		_socket = new WebSocket('ws://45.76.55.195:1025');
	} else {
		_socket = new WebSocket('wss://45.76.55.195:1025');
	}
	_socket.onopen = function () {
		_socket.send(JSON.stringify({
			func: "wb_register",
			data: uuid_list
		}));
		ping_thread = setInterval(function() {
			_socket.send(JSON.stringify({
				func: "ping"
			}));
		}, 30000);
	};
	_socket.onmessage = function (message) {
		json_data = JSON.parse(message.data);
		if(json_data.func == 'send_wb_refrush') {
			unset_switch(_socket);
			set_status(json_data.data);
			set_switch(_socket);
		} else if(json_data.func == 'send_wb_status') {
			var _uuid = json_data.uuid;
			unset_switch(_socket);
			if(json_data.status =="on") {
				set_on(_uuid);
			} else {
				set_off(_uuid);
			}
			set_switch(_socket);
		}
	};
	_socket.onerror = function (error) {
		console.log('WebSocket error: ' + error);
	};
	_socket.onclose = function (close) {
		console.log('WebSocket close: ' + close);
		setTimeout(start_websocket, 1000);
	};
}