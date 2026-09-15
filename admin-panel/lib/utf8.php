<?php
declare(strict_types=1);

/**
 * @param mixed $value
 * @return mixed
 */
function fix_utf8_recursive($value)
{
    if (is_string($value)) {
        return mb_scrub($value, 'UTF-8');
    }
    if (is_array($value)) {
        return array_map('fix_utf8_recursive', $value);
    }
    return $value;
}
