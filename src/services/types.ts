/**
 * Represents common service interface
 */
export interface Service {
  update(dt: number): void;
}

/**
 * Ingame browser interface
 */
export interface BrowserService extends Service {
  /**
   * Gets or sets browser visibility
   */
  visible: boolean;

  /**
   * Gets or sets browser focused state
   */
  focused: boolean;

  /**
   * Load browser content by url (html, css, js)
   * @param url 
   */
  loadByUrl(url: string): void;
}
