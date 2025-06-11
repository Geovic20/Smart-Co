from django import template

register = template.Library()

@register.filter
def mul(value, arg):
    """Multiplie deux nombres dans un template Django : {{ a|mul:b }}"""
    try:
        return float(value) * float(arg)
    except (ValueError, TypeError):
        return ''
