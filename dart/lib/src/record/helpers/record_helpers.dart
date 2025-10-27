/// Record helper functions for retrieving specific record types
///
/// This module provides convenience functions for retrieving specific types
/// of records from SNS domains, mirroring the JavaScript SDK exactly.
library;

import '../../constants/records.dart';
import '../../rpc/rpc_client.dart';
import '../get_record.dart';

/// Retrieves the Arweave record of a domain name
Future<String?> getArweaveRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.arwv);

/// Retrieves the background record of a domain name
Future<String?> getBackgroundRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.background);

/// Retrieves the Backpack record of a domain name
Future<String?> getBackpackRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.backpack);

/// Retrieves the Bitcoin record of a domain name
Future<String?> getBtcRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.btc);

/// Retrieves the BSC (Binance Smart Chain) record of a domain name
Future<String?> getBscRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.bsc);

/// Retrieves the Discord record of a domain name
Future<String?> getDiscordRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.discord);

/// Retrieves the Dogecoin record of a domain name
Future<String?> getDogeRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.doge);

/// Retrieves the email record of a domain name
Future<String?> getEmailRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.email);

/// Retrieves the Ethereum record of a domain name
Future<String?> getEthRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.eth);

/// Retrieves the GitHub record of a domain name
Future<String?> getGithubRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.github);

/// Retrieves the Injective Protocol record of a domain name
Future<String?> getInjectiveRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.injective);

/// Retrieves the IPFS record of a domain name
Future<String?> getIpfsRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.ipfs);

/// Retrieves the Litecoin record of a domain name
Future<String?> getLtcRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.ltc);

/// Retrieves the profile picture record of a domain name
Future<String?> getPicRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.pic);

/// Retrieves the point record of a domain name
Future<String?> getPointRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.point);

/// Retrieves the Reddit record of a domain name
Future<String?> getRedditRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.reddit);

/// Retrieves the Shadow Drive record of a domain name
Future<String?> getShdwRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.shdw);

/// Retrieves the Solana record of a domain name
Future<String?> getSolRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.sol);

/// Retrieves the Telegram record of a domain name
Future<String?> getTelegramRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.telegram);

/// Retrieves the Twitter record of a domain name
Future<String?> getTwitterRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.twitter);

/// Retrieves the URL record of a domain name
Future<String?> getUrlRecord(RpcClient connection, String domain) =>
    getRecordDeserialized(connection, domain, Record.url);
