import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import type { Client, Frame, Message } from "@stomp/stompjs";
import { axiosEnhanced } from "@/common/utils/axios/axiosEnhanced";
import { getToken } from "@/common/utils/axios/tokenUtils";

interface StompClientExtended extends Client {
	heartbeat: {
		outgoing: number;
		incoming: number;
	};
	reconnectDelay: number;
	connect(
		headers: Record<string, string>,
		connectCallback: (frame: Frame) => void,
		errorCallback: (error: WebSocketError) => void
	  ): void;
	disconnect: () => void;
}

type WebSocketError = {
	message: string;
	type?: string;
	details?: unknown;
}

type NotificationData = {
	title: string;
	relatedId: number;
}

type NotificationCallback = (notification: NotificationData) => void;

let stompClient: StompClientExtended | null = null;
let connected: boolean = false;
let heartbeatInterval: NodeJS.Timeout | null = null;

const connect = (
	userId: string, 
	onNotificationReceived: NotificationCallback, 
	retryCount: number = 0
): void => {
	try {
		const socket = new SockJS('/ws');
		stompClient = Stomp.over(() => socket) as StompClientExtended;

		const token = getToken();
		const connectHeaders: Record<string, string> = {};
		
		if(token) {
			connectHeaders['Authorization'] = token;
		}

		if(stompClient) {
			stompClient.heartbeat.outgoing = 20000;
			stompClient.heartbeat.incoming = 20000;
			stompClient.reconnectDelay = 5000;
		}

		console.log('connect console');

		stompClient?.connect(connectHeaders, (frame: Frame) => {
			console.log('Connected : ', frame);
			connected = true;

			//개인 알림 구독
			stompClient?.subscribe('/user/queue/notifications', (message: Message) => {
				const notification: NotificationData = JSON.parse(message.body);
				onNotificationReceived(notification);
			});
			
			//30초 간격 Heartbeat
			startHeartbeat();
		}, (error: WebSocketError) => {
			console.error('WebSocket connenction error : ', error);
			connected = false;

			if(retryCount < 3) {
				setTimeout(() => {
					console.log(`Retrying WebSocket connection ( ${retryCount + 1} / 3 )`);
					connect(userId, onNotificationReceived, retryCount + 1);
				}, 5000);
			}
		});
	} catch (error) {
		console.error('WebSocket connection failed:', error);
		connected = false;
	}
};

const startHeartbeat = (): void => {
	heartbeatInterval = setInterval(() => {
		if(connected && stompClient) {
			axiosEnhanced.get('/notification/heartbeat')
				.catch((error: WebSocketError) => {
					console.error('Heartbeat failed : ', error);
				});
		}
	}, 30000);
};

const disconnect = () => {
	if(heartbeatInterval) {
		clearInterval(heartbeatInterval);
		heartbeatInterval = null;
	}

	if(stompClient !== null) {
		stompClient.disconnect();
		connected = false;
	}

	console.log('Disconnected');
};

const isConnected = (): boolean => {
	return connected;
}

export {connect, disconnect, isConnected };
export type { NotificationData };