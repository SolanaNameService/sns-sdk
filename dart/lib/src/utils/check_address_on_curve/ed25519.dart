/// Ed25519 curve parameter: 2^255 - 19
final BigInt _p = BigInt.parse(
    '57896044618658097711785492504343953926634992332820282019728792003956564819949');

/// Ed25519 curve parameter: d = -121665/121666
final BigInt _d = BigInt.parse(
    '37095705934669439343138083508754565189542113879843219016388785533085940283555');

/// Checks if a point is on the Ed25519 curve.
///
/// This function implements the Ed25519 curve equation:
/// -x^2 + y^2 = 1 + d * x^2 * y^2
///
/// [y] - The y-coordinate as a BigInt
/// [signBit] - The sign bit from the compressed point
///
/// Returns true if the point is on the curve
bool pointIsOnCurve(BigInt y, int signBit) {
  // Validate inputs
  if (y < BigInt.zero || y >= _p) {
    return false;
  }

  try {
    // Calculate y^2
    final y2 = (y * y) % _p;

    // Calculate x^2 from the curve equation
    // x^2 = (y^2 - 1) / (d * y^2 + 1)
    final numerator = (y2 - BigInt.one) % _p;
    final denominator = (_d * y2 + BigInt.one) % _p;

    // Calculate modular inverse of denominator
    final denominatorInv = _modularInverse(denominator, _p);
    if (denominatorInv == null) {
      return false;
    }

    final x2 = (numerator * denominatorInv) % _p;

    // Check if x^2 is a quadratic residue (has a square root)
    if (!_isQuadraticResidue(x2, _p)) {
      return false;
    }

    // Calculate x from x^2
    final x = _modularSqrt(x2, _p);
    if (x == null) {
      return false;
    }

    // Check if the sign bit matches
    final computedSignBit = (x & BigInt.one).toInt();
    if (computedSignBit != signBit) {
      return false;
    }

    // Verify the point satisfies the curve equation
    // -x^2 + y^2 = 1 + d * x^2 * y^2
    final left = ((-x * x) + y2) % _p;
    final right = (BigInt.one + _d * x * x * y2) % _p;

    return left == right;
  } on Exception {
    return false;
  }
}

/// Calculates the modular inverse of a modulo m using the extended Euclidean algorithm.
BigInt? _modularInverse(BigInt a, BigInt m) {
  if (a < BigInt.zero) {
    a = a % m + m;
  }

  final g = _gcd(a, m);
  if (g != BigInt.one) {
    return null; // No inverse exists
  }

  return _extendedGcd(a, m).$1 % m;
}

/// Extended Euclidean algorithm to find gcd and coefficients.
(BigInt, BigInt) _extendedGcd(BigInt a, BigInt b) {
  if (b == BigInt.zero) {
    return (BigInt.one, BigInt.zero);
  }

  final (x1, y1) = _extendedGcd(b, a % b);
  final x = y1;
  final y = x1 - (a ~/ b) * y1;

  return (x, y);
}

/// Greatest common divisor using Euclidean algorithm.
BigInt _gcd(BigInt a, BigInt b) {
  while (b != BigInt.zero) {
    final temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/// Checks if a number is a quadratic residue modulo p using Euler's criterion.
bool _isQuadraticResidue(BigInt a, BigInt p) {
  if (a == BigInt.zero) return true;
  return _modPow(a, (p - BigInt.one) ~/ BigInt.two, p) == BigInt.one;
}

/// Computes modular square root using Tonelli-Shanks algorithm.
BigInt? _modularSqrt(BigInt n, BigInt p) {
  if (!_isQuadraticResidue(n, p)) {
    return null;
  }

  if (n == BigInt.zero) return BigInt.zero;

  // Special case for p ≡ 3 (mod 4)
  if ((p % BigInt.from(4)) == BigInt.from(3)) {
    return _modPow(n, (p + BigInt.one) ~/ BigInt.from(4), p);
  }

  // Tonelli-Shanks algorithm for general case
  // Find Q and S such that p - 1 = Q * 2^S with Q odd
  var q = p - BigInt.one;
  var s = 0;
  while ((q % BigInt.two) == BigInt.zero) {
    q = q ~/ BigInt.two;
    s++;
  }

  if (s == 1) {
    return _modPow(n, (p + BigInt.one) ~/ BigInt.from(4), p);
  }

  // Find a quadratic non-residue
  var z = BigInt.two;
  while (_isQuadraticResidue(z, p)) {
    z = z + BigInt.one;
  }

  // s is already stored as the exponent
  var c = _modPow(z, q, p);
  var t = _modPow(n, q, p);
  var r = _modPow(n, (q + BigInt.one) ~/ BigInt.two, p);

  while (t != BigInt.one) {
    // Find the smallest i such that t^(2^i) = 1
    var temp = t;
    var i = 1;
    while (temp != BigInt.one && i < s) {
      temp = (temp * temp) % p;
      i++;
    }

    if (i == s) return null; // Should not happen if n is a QR

    // Update values
    final b = _modPow(c, _pow(BigInt.two, s - i - 1), p);
    c = (b * b) % p;
    t = (t * c) % p;
    r = (r * b) % p;
  }

  return r;
}

/// Modular exponentiation: (base^exp) mod m
BigInt _modPow(BigInt base, BigInt exp, BigInt m) {
  var result = BigInt.one;
  base = base % m;

  while (exp > BigInt.zero) {
    if ((exp % BigInt.two) == BigInt.one) {
      result = (result * base) % m;
    }
    exp = exp ~/ BigInt.two;
    base = (base * base) % m;
  }

  return result;
}

/// Power function for BigInt
BigInt _pow(BigInt base, int exp) {
  var result = BigInt.one;
  for (var i = 0; i < exp; i++) {
    result *= base;
  }
  return result;
}
