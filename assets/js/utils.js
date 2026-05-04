const Utils = {
  formatRelativeDate(dateString) {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return 'agora';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m atrás`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
      return `${Math.floor(diffInSeconds / 86400)}d atrás`;
    } catch (e) {
      return dateString;
    }
  },

  truncate(text, length = 100) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  },

  getDomain(url) {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  }
};
