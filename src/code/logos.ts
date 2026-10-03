import tokenLogoABI from "../data/token_logo_abi.json";
import { TokenLogoContract, TokenLogoParams, TokenMetadata } from "../types";
import { getConfig } from "./config";
import { getContract } from "./methods";

const
    /** Token logo getters, in priority order */
    tokenLogoGetters: (keyof TokenLogoContract)[] = [
        `logoURI`,
        `logo`,
        `image`,
        `icon`,
    ],
    /** Maximum accepted logo length (chars) */
    tokenLogoMaxLength = 512e3,
    /** Metadata fetch timeout (ms) */
    tokenLogoFetchTimeout = 8e3,
    /** Image extensions accepted from a tokenURI */
    tokenLogoImageExt = /\.(?:png|jpe?g|gif|webp|avif)(?:[?#]|$)/i,
    /** Unsafe, never embed */
    tokenLogoUnsafeExt = /\.(?:svg|html?)(?:[?#]|$)/i,
    /** Private / loopback / special-use hosts */
    tokenLogoPrivateHost = /^(?:localhost|0\.|10\.|127\.|169\.254\.|172\.(?:1[6-9]|2\d|3[01])\.|192\.168\.|::1?$|::ffff:|64:ff9b:|2001:db8:|f[cd][0-9a-f]{0,2}:|fe[89abcdef]|ff[0-9a-f]{2}:)/i,
    /** Resolve an ipfs uri through the gateway */
    resolveIpfs = (uri: string): string | undefined => {
        const
            gateway = (getConfig().ipfsGateway || ``).replace(/\/+$/, ``),
            path = uri.slice(7).replace(/^(?:ipfs\/|\/)+/, ``);
        return gateway && path ? `${gateway}/${path}` : undefined;
    },
    /** Public, safe-to-embed https url */
    isSafeUrl = (value: string): boolean => {
        try {
            const { protocol, hostname } = new URL(value);
            if (protocol != `https:` || tokenLogoUnsafeExt.test(value))
                return false;
            const
                host = hostname.replace(/^\[|\]$/g, ``),
                literal = /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)
                    || host.includes(`:`);
            return !tokenLogoPrivateHost.test(host)
                && (literal || /\.[a-z]{2,}$/.test(host));
        } catch (e) {
            return false;
        };
    },
    /** Normalize a candidate logo uri */
    normalizeLogoUri = (uri?: string): string | undefined => {
        const value = (uri || ``).trim();
        if (!value || value == `0x`) return;
        if (value.startsWith(`data:image/`))
            return /^data:image\/svg/i.test(value)
                || value.length > tokenLogoMaxLength
                ? undefined
                : value;
        const resolved = value.startsWith(`ipfs://`)
            ? resolveIpfs(value)
            : value;
        if (resolved && isSafeUrl(resolved)) return resolved;
    },
    /** Fetch json metadata (data, ipfs or https) */
    fetchTokenMetadata = async (
        uri: string
    ): Promise<TokenMetadata | undefined> => {
        try {
            // inline data uri
            if (uri.startsWith(`data:`)) {
                if (uri.length > tokenLogoMaxLength) return;
                const comma = uri.indexOf(`,`);
                if (comma < 0) return;
                const
                    header = uri.slice(5, comma),
                    body = uri.slice(comma + 1);
                return JSON.parse(
                    header.includes(`base64`)
                        ? new TextDecoder().decode(
                            Uint8Array.from(atob(body), c => c.charCodeAt(0))
                        )
                        : decodeURIComponent(body)
                );
            };

            const resolved = uri.startsWith(`ipfs://`)
                ? resolveIpfs(uri)
                : uri;
            if (!resolved || !isSafeUrl(resolved)) return;

            const
                controller = new AbortController(),
                timer = setTimeout(
                    () => controller.abort(),
                    tokenLogoFetchTimeout
                );
            try {
                const response = await fetch(resolved, {
                    signal: controller.signal,
                    redirect: `error`,
                    credentials: `omit`,
                    referrerPolicy: `no-referrer`,
                });
                if (
                    !response.ok
                    || +(response.headers.get(`content-length`) || 0)
                    > tokenLogoMaxLength
                ) return;
                const text = await response.text();
                if (text.length > tokenLogoMaxLength) return;
                return JSON.parse(text);
            } finally {
                clearTimeout(timer);
            };
        } catch (e) { };
    },
    /** Resolve token logo (custom, onchain, tokenURI) */
    resolveTokenLogo = async ({
        chain,
        tokenAddress,
    }: TokenLogoParams): Promise<string | undefined> => {
        try {
            const custom = await getConfig().getTokenLogo?.(
                chain,
                tokenAddress
            );
            if (custom) return custom;
        } catch (e) { };

        try {
            const
                contract = await getContract(
                    chain,
                    false,
                    tokenAddress,
                    tokenLogoABI
                ) as unknown as TokenLogoContract,
                logos = await Promise.all(
                    tokenLogoGetters.map(async fn => {
                        try {
                            return normalizeLogoUri(
                                (await contract[fn]?.())?.toString()
                            );
                        } catch (e) { };
                    })
                );
            for (let i = 0; i < logos.length; i++) {
                if (logos[i]) return logos[i];
            };

            const
                uri = (await contract.tokenURI?.())?.toString() || ``,
                direct = normalizeLogoUri(uri);
            if (
                direct?.startsWith(`data:image`)
                || (direct && tokenLogoImageExt.test(direct))
            ) return direct;

            const metadata = await fetchTokenMetadata(uri);
            return normalizeLogoUri(
                metadata?.image
                || metadata?.image_url
                || metadata?.image_data
                || metadata?.data?.image
            );
        } catch (e) { };
    };

export {
    resolveTokenLogo,
};
