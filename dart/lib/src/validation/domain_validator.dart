/// Domain validation utilities for SNS domains
///
/// Provides comprehensive validation matching the JavaScript SDK validation rules
/// for domain names, subdomains, and various domain-related operations.
library;

/// Exception thrown when domain validation fails
class DomainValidationError implements Exception {
  const DomainValidationError(this.domain, this.reason);
  final String domain;
  final String reason;

  @override
  String toString() =>
      'DomainValidationError: Domain "$domain" is invalid: $reason';
}

/// Comprehensive domain validation system matching JavaScript SDK rules
class DomainValidator {
  /// Regular expression for valid domain characters
  static final RegExp _validDomainRegex = RegExp(r'^[a-z0-9\-]+$');

  /// Maximum domain length (excluding .sol suffix)
  static const int maxDomainLength = 64;

  /// Minimum domain length
  static const int minDomainLength = 1;

  /// Reserved domains that cannot be registered
  static const Set<String> reservedDomains = {
    'sol',
    'www',
    'api',
    'admin',
    'root',
    'system',
    'network',
    'protocol',
    'service',
    'config',
    'status',
    'health',
    'debug',
    'test',
    'demo',
    'example',
    'placeholder',
    'reserved',
    'null',
    'undefined',
    'void',
    'empty',
    'blank',
    'default',
    'localhost',
    'solana',
    'bonfida',
    'sns',
  };

  /// Validates a domain name according to SNS rules.
  ///
  /// @param domain The domain name to validate (without .sol suffix)
  /// @returns True if the domain is valid, false otherwise
  ///
  /// For detailed validation with error messages, use validateDomainDetailed.
  static bool isValidDomain(String domain) {
    try {
      validateDomainDetailed(domain);
      return true;
    } on DomainValidationError {
      return false;
    }
  }

  /// Validates a domain name and throws detailed error if invalid.
  ///
  /// @param domain The domain name to validate (without .sol suffix)
  /// @throws DomainValidationError if the domain is invalid with specific reason
  static void validateDomainDetailed(String domain) {
    // Check if domain is empty
    if (domain.isEmpty) {
      throw DomainValidationError(domain, 'Domain cannot be empty');
    }

    // Check minimum length
    if (domain.length < minDomainLength) {
      throw DomainValidationError(
          domain, 'Domain must be at least $minDomainLength character long');
    }

    // Check maximum length
    if (domain.length > maxDomainLength) {
      throw DomainValidationError(
          domain, 'Domain cannot exceed $maxDomainLength characters');
    }

    // Check for valid characters (only lowercase alphanumeric and hyphens)
    if (!_validDomainRegex.hasMatch(domain)) {
      throw DomainValidationError(domain,
          'Domain can only contain lowercase letters, numbers, and hyphens');
    }

    // Check that domain doesn't start or end with hyphen
    if (domain.startsWith('-') || domain.endsWith('-')) {
      throw DomainValidationError(
          domain, 'Domain cannot start or end with a hyphen');
    }

    // Check for consecutive hyphens
    if (domain.contains('--')) {
      throw DomainValidationError(
          domain, 'Domain cannot contain consecutive hyphens');
    }

    // Check reserved domains
    if (reservedDomains.contains(domain.toLowerCase())) {
      throw DomainValidationError(
          domain, 'Domain is reserved and cannot be registered');
    }

    // Check for all numeric domains (not allowed)
    if (RegExp(r'^\d+$').hasMatch(domain)) {
      throw DomainValidationError(domain, 'Domain cannot be all numeric');
    }

    // Check for domains that look like IP addresses
    if (_looksLikeIpAddress(domain)) {
      throw DomainValidationError(
          domain, 'Domain cannot look like an IP address');
    }
  }

  /// Validates a subdomain name according to SNS rules
  ///
  /// [subdomain] - The subdomain name to validate
  /// [parent] - The parent domain name
  ///
  /// Returns true if the subdomain is valid for the given parent.
  static bool isValidSubdomain(String subdomain, String parent) {
    try {
      validateSubdomainDetailed(subdomain, parent);
      return true;
    } on DomainValidationError {
      return false;
    }
  }

  /// Validates a subdomain name and throws detailed error if invalid
  ///
  /// [subdomain] - The subdomain name to validate
  /// [parent] - The parent domain name
  ///
  /// Throws [DomainValidationError] if the subdomain is invalid.
  static void validateSubdomainDetailed(String subdomain, String parent) {
    // First validate the subdomain itself as a domain
    validateDomainDetailed(subdomain);

    // Validate the parent domain
    validateDomainDetailed(parent);

    // Check that subdomain is different from parent
    if (subdomain.toLowerCase() == parent.toLowerCase()) {
      throw DomainValidationError(
          subdomain, 'Subdomain cannot be the same as parent domain');
    }

    // Additional subdomain-specific rules
    if (subdomain == 'www') {
      throw DomainValidationError(
          subdomain, '"www" is not allowed as a subdomain');
    }

    // Check total length when combined (subdomain.parent.sol)
    final totalLength =
        subdomain.length + 1 + parent.length + 4; // +1 for dot, +4 for .sol
    if (totalLength > 100) {
      // Reasonable limit for full domain
      throw DomainValidationError(
          subdomain, 'Combined subdomain and parent domain length is too long');
    }
  }

  /// Validates a full domain path (e.g., "sub.domain")
  ///
  /// [fullDomain] - The full domain path to validate
  ///
  /// Returns true if the full domain path is valid.
  static bool isValidDomainPath(String fullDomain) {
    try {
      validateDomainPathDetailed(fullDomain);
      return true;
    } on DomainValidationError {
      return false;
    }
  }

  /// Validates a full domain path and throws detailed error if invalid
  ///
  /// [fullDomain] - The full domain path to validate (e.g., "sub.domain")
  ///
  /// Throws [DomainValidationError] if the domain path is invalid.
  static void validateDomainPathDetailed(String fullDomain) {
    if (fullDomain.isEmpty) {
      throw DomainValidationError(fullDomain, 'Domain path cannot be empty');
    }

    final parts = fullDomain.split('.');

    if (parts.isEmpty) {
      throw DomainValidationError(fullDomain, 'Invalid domain path format');
    }

    // Validate each part
    for (var i = 0; i < parts.length; i++) {
      final part = parts[i];

      try {
        validateDomainDetailed(part);
      } on DomainValidationError catch (e) {
        throw DomainValidationError(
            fullDomain, 'Invalid part "$part": ${e.reason}');
      }
    }

    // If there are multiple parts, validate as subdomain relationship
    if (parts.length > 1) {
      final subdomain = parts[0];
      final parent = parts.sublist(1).join('.');

      try {
        validateSubdomainDetailed(subdomain, parent);
      } on DomainValidationError catch (e) {
        throw DomainValidationError(fullDomain, e.reason);
      }
    }
  }

  /// Normalizes a domain name by converting to lowercase and trimming
  ///
  /// [domain] - The domain name to normalize
  ///
  /// Returns the normalized domain name.
  static String normalizeDomain(String domain) => domain.trim().toLowerCase();

  /// Extracts the root domain from a full domain path
  ///
  /// [fullDomain] - The full domain path (e.g., "sub.domain")
  ///
  /// Returns the root domain (e.g., "domain").
  static String extractRootDomain(String fullDomain) {
    final parts = fullDomain.split('.');
    return parts.last;
  }

  /// Extracts the subdomain from a full domain path
  ///
  /// [fullDomain] - The full domain path (e.g., "sub.domain")
  ///
  /// Returns the subdomain part or null if no subdomain.
  static String? extractSubdomain(String fullDomain) {
    final parts = fullDomain.split('.');
    if (parts.length <= 1) return null;
    return parts.sublist(0, parts.length - 1).join('.');
  }

  /// Checks if a domain looks like an IP address
  static bool _looksLikeIpAddress(String domain) {
    // Check for IPv4-like patterns
    final parts = domain.split('.');
    if (parts.length == 4) {
      return parts.every((part) {
        final num = int.tryParse(part);
        return num != null && num >= 0 && num <= 255;
      });
    }

    // Check for IPv6-like patterns (basic check)
    if (domain.contains(':')) {
      return true;
    }

    return false;
  }

  /// Gets a human-readable description of domain validation rules
  static String getValidationRules() => '''
Domain Validation Rules:
• Must be 1-64 characters long
• Only lowercase letters (a-z), numbers (0-9), and hyphens (-) allowed
• Cannot start or end with a hyphen
• Cannot contain consecutive hyphens
• Cannot be all numeric
• Cannot look like an IP address
• Cannot be a reserved domain name
• Subdomains follow the same rules plus additional restrictions
    ''';
}
