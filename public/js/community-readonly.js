(function() {
	const root = document.getElementById("matrix-readonly");
	if (!root) {
		return;
	}

	const statusEl = document.getElementById("matrix-status");
	const timelineEl = document.getElementById("matrix-timeline");
	const homeserver = root.getAttribute("data-homeserver") || "https://matrix.org";
	const roomAlias = root.getAttribute("data-room-alias") || "#freeos.me:matrix.org";

	function setStatus(message) {
		if (statusEl) {
			statusEl.textContent = message;
		}
	}

	function formatTimestamp(ms) {
		if (!ms) {
			return "";
		}
		return new Date(ms).toLocaleString();
	}

	function displayNameFromSender(sender) {
		if (!sender || sender[0] !== "@") {
			return sender || "unknown";
		}
		const noAt = sender.slice(1);
		const localpart = noAt.split(":")[0];
		return localpart || sender;
	}

	function renderMessages(events) {
		if (!timelineEl) {
			return;
		}

		timelineEl.innerHTML = "";

		if (!events.length) {
			setStatus("No public messages found yet.");
			return;
		}

		setStatus("Latest public messages");

		events.forEach(function(event) {
			const li = document.createElement("li");
			li.className = "matrix-message";

			const header = document.createElement("div");
			header.className = "matrix-message-head";

			const sender = document.createElement("strong");
			sender.textContent = displayNameFromSender(event.sender);

			const time = document.createElement("span");
			time.className = "matrix-time";
			time.textContent = formatTimestamp(event.origin_server_ts);

			header.appendChild(sender);
			header.appendChild(time);

			const body = document.createElement("p");
			body.className = "matrix-body";
			body.textContent = event.content && event.content.body ? event.content.body : "";

			li.appendChild(header);
			li.appendChild(body);
			timelineEl.appendChild(li);
		});
	}

	async function loadTimeline() {
		try {
			const aliasPath = "/_matrix/client/v3/directory/room/" + encodeURIComponent(roomAlias);
			const aliasRes = await fetch(homeserver + aliasPath, { method: "GET" });

			if (!aliasRes.ok) {
				throw new Error("Could not resolve room alias");
			}

			const aliasData = await aliasRes.json();
			const roomId = aliasData.room_id;
			const msgPath = "/_matrix/client/v3/rooms/" + encodeURIComponent(roomId) + "/messages?dir=b&limit=25";
			const msgRes = await fetch(homeserver + msgPath, { method: "GET" });

			if (msgRes.status === 401 || msgRes.status === 403) {
				setStatus("This room is not configured for anonymous public history (world_readable). Please open it in Matrix.");
				return;
			}

			if (!msgRes.ok) {
				throw new Error("Failed to load room messages");
			}

			const msgData = await msgRes.json();
			const events = (msgData.chunk || []).filter(function(event) {
				if (event.type !== "m.room.message") {
					return false;
				}
				const msgType = event.content && event.content.msgtype;
				return msgType === "m.text" || msgType === "m.notice" || msgType === "m.emote";
			});

			renderMessages(events.reverse());
		} catch (error) {
			setStatus("Unable to load Matrix timeline right now. Please use the links above.");
		}
	}

	loadTimeline();
})();
