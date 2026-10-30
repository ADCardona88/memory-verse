function decodeBasicEntities(text) {
  return String(text)
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'");
}

function removeBalancedTag(html, openPattern) {
  var result = String(html);
  var openRegex = new RegExp(openPattern, "i");

  while (true) {
    var match = openRegex.exec(result);
    if (!match) {
      break;
    }

    var start = match.index;
    var pos = start + match[0].length;
    var depth = 1;

    while (pos < result.length && depth > 0) {
      var nextOpen = result.slice(pos).search(/<[a-z][^>]*>/i);
      var nextClose = result.slice(pos).search(/<\/[a-z][^>]*>/i);

      if (nextClose === -1) {
        break;
      }

      if (nextOpen !== -1 && nextOpen < nextClose) {
        var openTag = result.slice(pos + nextOpen).match(/^<[a-z][^>]*>/i)[0];
        if (!/\/\s*>$/.test(openTag)) {
          depth += 1;
        }
        pos += nextOpen + openTag.length;
      } else {
        var closeTag = result.slice(pos + nextClose).match(/^<\/[a-z][^>]*>/i)[0];
        depth -= 1;
        pos += nextClose + closeTag.length;
      }
    }

    if (depth !== 0) {
      break;
    }

    result = result.slice(0, start) + result.slice(pos);
    openRegex.lastIndex = 0;
  }

  return result;
}

function cleanNltPassageHtml(html) {
  var text = String(html);

  var verseMatch = text.match(/<verse_export[^>]*>([\s\S]*?)<\/verse_export>/i);
  if (verseMatch) {
    text = verseMatch[1];
  } else {
    text = text.replace(/<h2[^>]*bk_ch_vs_header[^>]*>[\s\S]*?<\/h2>/gi, "");
  }

  text = removeBalancedTag(text, '<span[^>]*class="[^"]*\\btn\\b[^"]*"[^>]*>');
  text = text.replace(/<a[^>]*class="[^"]*\ba-tn\b[^"]*"[^>]*>[\s\S]*?<\/a>/gi, "");
  text = text.replace(/<span[^>]*class="[^"]*\bvn\b[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "");
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<[^>]+>/g, "");
  text = decodeBasicEntities(text);
  text = text.replace(/\u00a0/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

function buildNltPassageUrl(bookName, chapter, verse) {
  var ref = encodeURIComponent(bookName + "." + chapter + "." + verse);
  return "https://api.nlt.to/api/passages?ref=" + ref;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    cleanNltPassageHtml: cleanNltPassageHtml,
    buildNltPassageUrl: buildNltPassageUrl,
  };
}
