from django import template

register = template.Library()

@register.filter
def pretty_name(value):
    return value.replace("_", " ").title()
