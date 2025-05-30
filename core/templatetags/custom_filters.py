from django import template

register = template.Library()

@register.filter
def get_range(value):
    return range(1, value + 1)

@register.filter
def pretty_name(value):
    return value.replace("_", " ").title()
